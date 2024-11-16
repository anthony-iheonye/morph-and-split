import { SimpleGrid } from "@chakra-ui/react";
import useAugConfigStore from "../store";
import PreviewCard from "./PreviewCard";
import { useMemo } from "react";
import PreviewContainer from "./PreviewContainer";

const PreviewGrid = () => {
  const images = useAugConfigStore((state) => state.augConfig.images);
  const masks = useAugConfigStore((state) => state.augConfig.masks);
  const previewSelection = useAugConfigStore((state) => state.previewSelection);

  const pairedData = useMemo(
    () =>
      images?.map((image, index) => ({
        image,
        mask: masks?.[index],
      })),
    [images, masks]
  );

  if (!previewSelection) return null;

  return (
    <SimpleGrid
      columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      spacing={6}
      padding={"10px"}
    >
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

export default PreviewGrid;
