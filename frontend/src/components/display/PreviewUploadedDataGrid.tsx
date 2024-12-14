import { SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import useUploadedImageMask from "../../hooks/useUploadedImageMask";
import useAugConfigStore from "../../store/augConfigStore";
import PreviewCard from "./PreviewCard";
import PreviewContainer from "./PreviewContainer";

const PreviewUploadedDataGrid = () => {
  const previewSelection = useAugConfigStore((state) => state.previewSelection);

  const { data, error, isLoading } = useUploadedImageMask();

  if (!previewSelection) return null;
  if (isLoading) return <Spinner />;
  if (error)
    return (
      <Text color="red.500">Failed to load uploaded images and masks.</Text>
    );

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

export default PreviewUploadedDataGrid;
