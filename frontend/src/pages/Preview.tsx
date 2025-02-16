import { Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { HiViewGrid } from "react-icons/hi";
import ContinueBtn from "../components/buttons/ContinueBtn";
import PreviousBtn from "../components/buttons/PreviousBtn";
import { BoundingBox, PreviewUploadedDataGrid } from "../components/display";
import IconHeadingDescriptionCombo from "../components/miscellaneous/IconHeadingDescriptionCombo";
import PageTitle from "../components/miscellaneous/PageTitle";
import PreviewSwitch from "../components/switches/PreviewSwitch";

const Preview = () => {
  return (
    <Grid
      templateAreas={{
        base: `"title"
               "previewSlider"
               "previewGrid"
               "navBtn"`,
      }}
      templateColumns={{ base: "1fr" }}
      templateRows={{ base: "auto auto 1fr auto" }}
      overflow="hidden"
    >
      <GridItem area="title" mt={8}>
        <PageTitle title="Preview" />
      </GridItem>

      <GridItem area="previewSlider">
        <BoundingBox>
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={HiViewGrid}
              title="Preview Upload"
              description={{
                md: "Click slider to preview uploaded images and their corresponding masks.",
              }}
            />
            <PreviewSwitch />
          </HStack>
        </BoundingBox>
      </GridItem>

      <GridItem
        area="previewGrid"
        display="flex"
        flexDirection="column"
        flex="1"
        overflow="hidden"
      >
        <BoundingBox
          mt={0}
          display="flex"
          flex="1"
          flexDirection="column"
          overflow="auto"
        >
          <Text color={"gray.400"} fontSize="sm">
            Preview of uploaded Images and Masks.
          </Text>
          <PreviewUploadedDataGrid />
        </BoundingBox>
      </GridItem>

      <GridItem area="navBtn">
        <BoundingBox transparent padding={0} mt={0}>
          <HStack justifyContent={{ base: "center", md: "start" }}>
            <PreviousBtn to="/upload_data/masks" />
            <ContinueBtn to="/settings/data_split" />
          </HStack>
        </BoundingBox>
      </GridItem>
    </Grid>
  );
};

export default Preview;
