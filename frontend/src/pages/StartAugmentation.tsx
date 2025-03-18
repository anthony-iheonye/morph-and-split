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
import {
  CopyrightBar,
  PageTitle,
  ThemedText,
} from "../components/miscellaneous";
import { useBackendResponse } from "../hooks";
import useAugmentationIsComplete from "../hooks/useAugmentationIsComplete";
import { handleDownloadGCSFiles } from "../services";
// import { handleDownloadLocalFiles } from "../services";

const StartAugmentation = () => {
  const { data: augmentationCompleted } = useAugmentationIsComplete();
  const { augmentationIsRunning, setBackendResponseLog } = useBackendResponse();

  return (
    <Grid
      templateAreas={{
        base: `"title"
               "suffix"
               "navBtn"
               "copyright"`,
      }}
      templateColumns={{ base: "1fr" }}
      templateRows={{ base: "auto 1fr auto" }}
      overflow="hidden"
      maxHeight="100%"
    >
      <GridItem area="title">
        <PageTitle title="Start Augmentation" />
      </GridItem>

      <GridItem
        area="suffix"
        display="flex"
        flexDirection="column"
        // flex="1"
        overflow="hidden"
      >
        <BoundingBox
          display="flex"
          flexDirection="column"
          // flex="1"
          overflow="hidden"
        >
          <ThemedText mb={4} fontSize="sm">
            Augmented images and masks are named with an 'img' or 'mask' prefix
            followed by a numerical suffix (e.g., 'img_1.png', 'mask_1.png').
            Enter the starting suffix for the first augmented training,
            validation, and test sets.
          </ThemedText>

          <VStack
            spacing={{ base: 5, md: 4, lg: 8 }}
            // flex="1"
            overflowY="auto"
            paddingRight={3}
            pt={2}
            align="start"
          >
            <SaveSuffixInput
              title={{
                base: "Training set",
                md: "Numerical suffix for Training Set",
              }}
              setName="training"
              icon={TbNumbers}
            />

            <SaveSuffixInput
              title={{
                base: "Validation set",
                md: "Numerical suffix for Validation Set",
              }}
              setName="validation"
              icon={TbNumbers}
            />

            <SaveSuffixInput
              title={{
                base: "Test set",
                md: "Numerical suffix for Test Set",
              }}
              setName="testing"
              icon={TbNumbers}
            />
          </VStack>
        </BoundingBox>
      </GridItem>

      <GridItem area="navBtn">
        <BoundingBox transparent padding={0} mb={{ base: 3.5, md: 4 }}>
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
                onDownload={() =>
                  handleDownloadGCSFiles(
                    ["augmented_data.zip"],
                    setBackendResponseLog
                  )
                }
              />
            )}
          </HStack>
        </BoundingBox>
      </GridItem>

      <GridItem area="copyright">
        <CopyrightBar />
      </GridItem>
    </Grid>
  );
};

export default StartAugmentation;
