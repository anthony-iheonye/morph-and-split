import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import ImageSelector from "./components/buttons/ImageSelector";
import MaskSelector from "./components/buttons/MaskSelector";
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
        <ImageSelector />
        <MaskSelector />
      </GridItem>
      <GridItem area="copyright" bg="green">
        <CopyrightBar />
      </GridItem>
    </Grid>
  );
}

export default App;
