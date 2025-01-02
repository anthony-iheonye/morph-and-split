import { Button, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import useUploadedImageMask from "../../hooks/useUploadedImageMask";
import useAugConfigStore from "../../store/augConfigStore";
import PreviewCard from "./PreviewCard";
import PreviewContainer from "./PreviewContainer";
import React from "react";

const PreviewUploadedDataGrid = () => {
  const previewSelection = useAugConfigStore((state) => state.previewSelection);

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useUploadedImageMask();

  if (!previewSelection) return null;
  if (isLoading) return <Spinner />;
  if (error)
    return (
      <Text color="red.500">Failed to load uploaded images and masks.</Text>
    );

  return (
    <>
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3 }}
        spacing={6}
        padding={"10px"}
      >
        {data?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.results.map(({ image, mask }) => (
              <PreviewContainer key={image.name}>
                <PreviewCard image={image} mask={mask} />
              </PreviewContainer>
            ))}
          </React.Fragment>
        ))}
      </SimpleGrid>
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </Button>
      )}
    </>
  );
};

export default PreviewUploadedDataGrid;
