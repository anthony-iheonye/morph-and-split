import { Grid, GridItem, HStack } from "@chakra-ui/react";
import AugSettingsForm from "../components/AugSettingsForm";
import CopyrightBar from "../components/CopyrightBar";
import ImageSelector from "../components/ImageSelector";
import MaskSelector from "../components/MaskSelector";
import NavBar from "../components/NavBar";
import PreviewGrid from "../components/PreviewGrid";
import PreviewSwitch from "../components/PreviewSwitch";

const HomePage = () => {
  return (
    <Grid
      templateAreas={{
        base: `"nav"
               "aside"
               "main"
               "copyright"`,
        md: `"nav aside main"
             "nav aside main"
             "nav copyright copyright"`,
      }}
    >
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <GridItem area="aside" bg="gold">
        aside
      </GridItem>
      <GridItem area="main">
        <HStack>
          <ImageSelector />
          <MaskSelector />
        </HStack>
        <PreviewSwitch />
        <PreviewGrid />
        <AugSettingsForm />
      </GridItem>
      <GridItem area="copyright" bg="gray.900">
        <CopyrightBar />
      </GridItem>
    </Grid>
  );
};

export default HomePage;
