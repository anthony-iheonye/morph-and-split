import { Box, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useUploadedImageMask } from "../../hooks";
import { AugConfigStore, useAugConfigStore } from "../../store";
import PreviewCard from "./PreviewCard";
import PreviewCardSkeleton from "./PreviewCardSkeleton";
import PreviewContainer from "./PreviewContainer";

/**
 * PreviewUploadedDataGrid displays a scrollable, responsive grid of uploaded image-mask pairs.
 *
 * Uses infinite scrolling to lazily load data fetched via React Query and displays loading
 * skeletons during fetches. This component is shown only when a preview selection is active.
 */
const PreviewUploadedDataGrid = () => {
  const previewSelection = useAugConfigStore(
    (state: AugConfigStore) => state.previewSelection
  );

  const { data, error, isLoading, fetchNextPage, hasNextPage } =
    useUploadedImageMask();

  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
        maxHeight={{ base: "50vh", md: "62vh" }}
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
            {isLoading &&
              skeletons.map((skeleton) => (
                <PreviewContainer key={skeleton}>
                  <PreviewCardSkeleton />
                </PreviewContainer>
              ))}

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
