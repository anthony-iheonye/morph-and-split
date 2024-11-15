import { Grid, GridItem, HStack } from "@chakra-ui/react";
import CopyrightBar from "./components/CopyrightBar";
import NavBar from "./components/NavBar";
import ImageSelector from "./components/ImageSelector";
import MaskSelector from "./components/MaskSelector";
import PreviewGrid from "./components/PreviewGrid";

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
      <GridItem area="main">
        <HStack>
          <ImageSelector />
          <MaskSelector />
        </HStack>
        <PreviewGrid />
      </GridItem>
      <GridItem area="copyright" bg="gray.900">
        <CopyrightBar />
      </GridItem>
    </Grid>
  );
}

export default App;
