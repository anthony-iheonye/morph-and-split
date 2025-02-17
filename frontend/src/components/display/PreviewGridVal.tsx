import { Box, Spinner, SimpleGrid, Text } from "@chakra-ui/react";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useValidationSet } from "../../hooks";
import { useAugConfigStore } from "../../store";
import PreviewCard from "./PreviewCard";
import PreviewContainer from "./PreviewContainer";

const PreviewGridVal = () => {
  const { previewAugmentedResult, previewedSet } = useAugConfigStore(
    (state) => ({
      previewAugmentedResult: state.previewAugmentedResult,
      previewedSet: state.augConfig.previewedSet,
    })
  );

  const { data, error, hasNextPage, fetchNextPage } = useValidationSet();

  if (!previewAugmentedResult || previewedSet != "val") return null;
  if (error) return <Text color="red.500">Failed to load validation set.</Text>;

  const fetchedImageMaskCount =
    data?.pages.reduce((total, page) => total + page.results.length, 0) || 0;

  return (
    <>
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

export default PreviewGridVal;
