import { Box, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useTestingSet from "../../hooks/useTestSet";
import { AugConfigStore, useAugConfigStore } from "../../store";
import PreviewCard from "./PreviewCard";
import PreviewCardSkeleton from "./PreviewCardSkeleton";
import PreviewContainer from "./PreviewContainer";

/**
 * PreviewGridTest is a grid-based display component that renders a paginated list
 * of previewed image-mask pairs from the test set.
 *
 * It uses infinite scrolling to dynamically load additional results from the backend.
 *
 * Conditional rendering is applied based on loading state, feature flags, and query results.
 */
const PreviewGridTest = () => {
  const { previewAugmentedResult, previewedSet } = useAugConfigStore(
    (state: AugConfigStore) => ({
      previewAugmentedResult: state.previewAugmentedResult,
      previewedSet: state.augConfig.previewedSet,
    })
  );

  const { data, error, isLoading, fetchNextPage, hasNextPage } =
    useTestingSet();

  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Do not render unless preview is active and test set is selected
  if (!previewAugmentedResult || previewedSet != "test") return null;
  if (error) return <Text color="red.500">Failed to load testing set.</Text>;

  // Total number of previewed image-mask pairs fetched
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

export default PreviewGridTest;
