import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import AugmentationSettings from "./components/AugmentationSettings";
import AugmentationSetting from "./components/AugmentationSetting";
import DirectorySelector from "./components/buttons/DirectorySelector";
import ImageDirectorySelector from "./components/buttons/ImageDirectorySelector";
import MaskDirectorySelector from "./components/buttons/MaskDirectorySelector";
import CopyrightBar from "./components/CopyrightBar";

function App() {
  return (
    <Grid
      templateAreas={{
        base: `"nav"
               "aside"
               "main"
               "copyright"`,
        lg: `"nav nav"
             "aside main"
              "copyright copyright"`,
      }}
    >
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <GridItem area="aside" bg="gold">
        aside
      </GridItem>
      <GridItem area="main" bg="dodgerblue">
        <ImageDirectorySelector />
        <MaskDirectorySelector />
      </GridItem>
      <GridItem area="copyright" bg="green">
        <CopyrightBar />
      </GridItem>
    </Grid>
  );
}

export default App;
