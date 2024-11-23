import { SimpleGrid } from "@chakra-ui/react";
import { useMemo } from "react";
import useAugConfigStore from "../store";
import PreviewCard from "./PreviewCard";
import PreviewContainer from "./PreviewContainer";

const PreviewAugmentedResultGrid = () => {
  const augmentedImages = useAugConfigStore(
    (state) => state.augConfig.augmentedImages
  );
  const augmentedMasks = useAugConfigStore(
    (state) => state.augConfig.augmentedMasks
  );
  const previewSelection = useAugConfigStore(
    (state) => state.previewAugmentedResult
  );

  const pairedData = useMemo(
    () =>
      augmentedImages?.map((image, index) => ({
        image,
        mask: augmentedMasks?.[index],
      })),
    [augmentedImages, augmentedMasks]
  );

  if (!previewSelection) return null;

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={6} padding={"10px"}>
      {pairedData?.map(
        (pair, index) =>
          pair.mask && (
            <PreviewContainer key={index}>
              <PreviewCard image={pair.image} mask={pair.mask} />
            </PreviewContainer>
          )
      )}
    </SimpleGrid>
  );
};

export default PreviewAugmentedResultGrid;
