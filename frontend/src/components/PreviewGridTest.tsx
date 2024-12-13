import { SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import useTestingSet from "../hooks/useTestSet";
import useAugConfigStore from "../store/augConfigStore";
import PreviewCard from "./PreviewCard";
import PreviewContainer from "./PreviewContainer";

const PreviewGridTest = () => {
  const { previewAugmentedResult, previewedSet } = useAugConfigStore(
    (state) => ({
      previewAugmentedResult: state.previewAugmentedResult,
      previewedSet: state.augConfig.previewedSet,
    })
  );

  const { data, error, isLoading } = useTestingSet();

  if (!previewAugmentedResult || previewedSet != "test") return null;
  if (isLoading) return <Spinner />;
  if (error) return <Text color="red.500">Failed to load testing set.</Text>;

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={6} padding={"10px"}>
      {data?.results.map(({ image, mask }) => (
        <PreviewContainer key={image.name}>
          <PreviewCard image={image} mask={mask} />
        </PreviewContainer>
      ))}
    </SimpleGrid>
  );
};

export default PreviewGridTest;
