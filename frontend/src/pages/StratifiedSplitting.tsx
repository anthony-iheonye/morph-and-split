import { Grid, GridItem, HStack, useBreakpointValue } from "@chakra-ui/react";
import { BsFiletypeCsv } from "react-icons/bs";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import {
  ContinueBtn,
  DeleteStratDataFile,
  PreviousBtn,
  StratifiedDataFileUploader,
} from "../components/buttons";
import { BoundingBox } from "../components/display";
import { SplitParameterSelector } from "../components/dropdowns";
import {
  CopyrightBar,
  IconComboControl,
  PageTitle,
  StratifiedFileHint,
  ThemedText,
} from "../components/miscellaneous";
import { useStratificationDataFileName } from "../hooks";

const StratifiedSplitting = () => {
  const { data } = useStratificationDataFileName();
  const fileName = data?.results[0];

  const splitDetail1 = useBreakpointValue({
    base: "Stratified splitting prevents class imbalance by ensuring that each set (training, validation, and test) maintains the same distribution of classes as the full dataset.",
    // md: "Set split ratios for the training, validation and test sets.",
  });

  const splitDetail2 = useBreakpointValue({
    base: "Upload a CSV file with parameters for each image to guide the split, keeping subsets representative of the full dataset. This improves model generalization by maintaining consistent class proportions.",
    // md: "Set split ratios for the training, validation and test sets.",
  });

  return (
    <Grid
      templateAreas={{
        base: `"title"
               "description"
               "csvFile"
               "splitParameter"
               "navBtn"
               "copyright"`,
      }}
      templateColumns={{ base: "1fr" }}
      templateRows={{ base: "auto auto auto auto 1fr auto" }}
      overflowY="hidden"
      maxHeight="100%"
    >
      <GridItem area="title">
        <PageTitle title="Stratified Splitting" />
      </GridItem>

      <BoundingBox
        transparent={true}
        padding="0"
        overflowY="auto"
        marginLeft={0}
        marginRight={0}
      >
        <GridItem area="description">
          <BoundingBox
            paddingBottom={{ base: 0, md: 0 }}
            transparent
            paddingTop={0}
            padding={2}
          >
            <ThemedText mb={4} fontSize="md" marginBottom={0}>
              {splitDetail1}
            </ThemedText>
            <ThemedText mb={0} fontSize="md" mt={2}>
              {splitDetail2}
            </ThemedText>
          </BoundingBox>
        </GridItem>

        <GridItem area="csvFile">
          <BoundingBox>
            <IconComboControl
              icon={BsFiletypeCsv}
              title="Stratifed Split Data"
              description={{
                md: "Select the CSV file containing the parameters for stratified splitting.",
              }}
              controlElement={<StratifiedDataFileUploader />}
              leftAlignDescription={false}
              titleHint={<StratifiedFileHint />}
            />
            <HStack justifySelf={"start"} mt={2}>
              {fileName && (
                <ThemedText
                  fontWeight="thin"
                  fontSize="sm"
                  lightModeTextColor="teal.500"
                  darkModeTextColor="teal.100"
                >
                  {fileName}
                </ThemedText>
              )}
              {fileName && <DeleteStratDataFile tooltipPlacment="top-end" />}
            </HStack>
          </BoundingBox>
        </GridItem>

        <GridItem area="splitParameter">
          <BoundingBox>
            <IconComboControl
              icon={HiOutlineArrowsExpand}
              title={{
                base: "Split Parameter",
                md: "Stratified Split Parameter",
              }}
              description={{
                base: "Choose a split parameter — often a skewed or underrepresented one — to ensure balanced class distribution across training, validation, and test sets.",
              }}
              controlElement={<SplitParameterSelector />}
              controlElementWidth="auto"
              leftAlignDescription={false}
            />
          </BoundingBox>
        </GridItem>
      </BoundingBox>

      <GridItem area="navBtn">
        <BoundingBox transparent padding={0} mb={{ base: 3.5, md: 4 }}>
          <HStack justifyContent={{ base: "center", md: "start" }}>
            <PreviousBtn to="/settings/data_split" />
            <ContinueBtn to="/settings/select_transformation" />
          </HStack>
        </BoundingBox>
      </GridItem>

      <GridItem area="copyright">
        <CopyrightBar />
      </GridItem>
    </Grid>
  );
};

export default StratifiedSplitting;
