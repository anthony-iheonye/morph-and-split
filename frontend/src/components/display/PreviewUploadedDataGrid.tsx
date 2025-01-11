import { Box, Spinner, SimpleGrid, Text } from "@chakra-ui/react";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useUploadedImageMask } from "../../hooks";
import { useAugConfigStore } from "../../store";
import PreviewCard from "./PreviewCard";
import PreviewContainer from "./PreviewContainer";

const PreviewUploadedDataGrid = () => {
  const previewSelection = useAugConfigStore((state) => state.previewSelection);

  const { data, error, fetchNextPage, hasNextPage } = useUploadedImageMask();

  if (!previewSelection) return null;
  if (error)
    return (
      <Text color="red.500">Failed to load uploaded images and masks.</Text>
    );

  const fetchedImageMaskCount =
    data?.pages.reduce((total, page) => total + page.results.length, 0) || 0;

  return (
    <>
      <Box
        id="uploadedDataBox"
        overflowY="auto"
        maxHeight={{ base: "75vh", md: "70vh" }}
        // height="100%"
        mt={4}
        flex="1"
      >
        <InfiniteScroll
          dataLength={fetchedImageMaskCount}
          hasMore={!!hasNextPage}
          next={() => fetchNextPage()}
          loader={<Spinner />}
          scrollableTarget="uploadedDataBox"
        >
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
        </InfiniteScroll>
      </Box>
    </>
  );
};

export default PreviewUploadedDataGrid;
