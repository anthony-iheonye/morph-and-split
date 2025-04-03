import { Box, Spinner, SimpleGrid, Text } from "@chakra-ui/react";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useValidationSet } from "../../hooks";
import { AugConfigStore, useAugConfigStore } from "../../store";
import PreviewCard from "./PreviewCard";
import PreviewContainer from "./PreviewContainer";
import PreviewCardSkeleton from "./PreviewCardSkeleton";

/**
 * PreviewGridVal is a component for displaying previewed validation image-mask pairs.
 *
 * It features infinite scrolling and renders preview cards in a responsive grid.
 * Skeleton loaders are shown during the loading state, and an error message is displayed
 * if the query fails. The component only renders if augmentation previewing is enabled
 * and the "val" (validation) set is selected.
 */
const PreviewGridVal = () => {
  const { previewAugmentedResult, previewedSet } = useAugConfigStore(
    (state: AugConfigStore) => ({
      previewAugmentedResult: state.previewAugmentedResult,
      previewedSet: state.augConfig.previewedSet,
    })
  );

  const { data, error, isLoading, hasNextPage, fetchNextPage } =
    useValidationSet();

  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  if (!previewAugmentedResult || previewedSet != "val") return null;
  if (error) return <Text color="red.500">Failed to load validation set.</Text>;

  const fetchedImageMaskCount =
    data?.pages.reduce((total, page) => total + page.results.length, 0) || 0;

  return (
    <Box id="valSetBox" overflowY="auto" flex="1">
      <InfiniteScroll
        dataLength={fetchedImageMaskCount}
        hasMore={!!hasNextPage}
        next={() => fetchNextPage()}
        loader={<Spinner />}
        scrollableTarget="valSetBox"
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
  );
};

export default PreviewGridVal;
