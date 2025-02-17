import { Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import { TbNumbers } from "react-icons/tb";
import {
  Augment,
  ContinueBtn,
  DownloadButton,
  PreviousBtn,
} from "../components/buttons";
import { BoundingBox } from "../components/display";
import { SaveSuffixInput } from "../components/inputFields";
import { PageTitle } from "../components/miscellaneous";
import { useBackendResponse } from "../hooks";
import useAugmentationIsComplete from "../hooks/useAugmentationIsComplete";
import { APIClient } from "../services";

const StartAugmentation = () => {
  const DownloadAPI = new APIClient<Blob>("/download/augmentation_results");
  const { data: augmentationCompleted } = useAugmentationIsComplete();
  const { augmentationIsRunning } = useBackendResponse();

  return (
    <Grid
      templateAreas={{
        base: `"title"
               "suffix"
               "navBtn"`,
      }}
      templateColumns={{ base: "1fr" }}
      templateRows={{ base: "auto 1fr auto" }}
      overflow="hidden"
      // height="100%"
    >
      <GridItem area="title">
        <PageTitle title="Start Augmentation" />
      </GridItem>

      <GridItem
        area="suffix"
        display="flex"
        flexDirection="column"
        flex="1"
        overflow="hidden"
      >
        <BoundingBox
          display="flex"
          flexDirection="column"
          flex="1"
          overflow="hidden"
        >
          <Text color={"gray.400"} mb={4} fontSize="sm">
            Augmented images and masks are named as 'img-1.jpg' and
            'mask-1.jpg'. Enter the starting numerical suffixes for the first
            augmented training, validation, and test data."
          </Text>

          <VStack
            spacing={{ base: 5, md: 4, lg: 8 }}
            flex="1"
            overflowY="auto"
            paddingRight={3}
            pt={2}
            align="start"
          >
            <SaveSuffixInput
              title={{
                base: "Training set",
                md: "Training Set Initial Save Suffix",
              }}
              setName="training"
              icon={TbNumbers}
            />

            <SaveSuffixInput
              title={{
                base: "Validation set",
                md: "Validation Set Initial Save Suffix",
              }}
              setName="validation"
              icon={TbNumbers}
            />

            <SaveSuffixInput
              title={{
                base: "Test set",
                md: "Test Set Initial Save Suffix",
              }}
              setName="testing"
              icon={TbNumbers}
            />
          </VStack>
        </BoundingBox>
      </GridItem>

      <GridItem area="navBtn">
        <BoundingBox transparent padding={0} mt={0}>
          <HStack justifyContent={{ base: "center", md: "start" }}>
            <PreviousBtn
              to="/settings/pre_processing"
              label={{ md: "Previous" }}
              disable={augmentationIsRunning}
            />
            <Augment />
            <ContinueBtn
              to="/augment/preview"
              label={{ md: "Continue" }}
              disable={augmentationIsRunning || !augmentationCompleted?.success}
            />
            {!augmentationIsRunning && augmentationCompleted?.success && (
              <DownloadButton
                filename="augmented_data.zip"
                onDownload={DownloadAPI.downloadFile}
              />
            )}
          </HStack>
        </BoundingBox>
      </GridItem>
    </Grid>
  );
};

export default StartAugmentation;
