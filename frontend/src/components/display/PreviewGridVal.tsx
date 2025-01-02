import { Button, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import useValidationSet from "../../hooks/useValidationSet";
import useAugConfigStore from "../../store/augConfigStore";
import PreviewCard from "./PreviewCard";
import PreviewContainer from "./PreviewContainer";
import React from "react";

const PreviewGridVal = () => {
  const { previewAugmentedResult, previewedSet } = useAugConfigStore(
    (state) => ({
      previewAugmentedResult: state.previewAugmentedResult,
      previewedSet: state.augConfig.previewedSet,
    })
  );

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useValidationSet();

  if (!previewAugmentedResult || previewedSet != "val") return null;
  if (isLoading) return <Spinner />;
  if (error) return <Text color="red.500">Failed to load validation set.</Text>;

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

export default PreviewGridVal;
