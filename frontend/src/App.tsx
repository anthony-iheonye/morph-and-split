import { Grid, GridItem } from "@chakra-ui/react";

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
      <GridItem area="nav" bg="coral">
        Nav
      </GridItem>
      <GridItem area="aside" bg="gold">
        aside
      </GridItem>
      <GridItem area="main" bg="dodgerblue">
        Main
      </GridItem>
      <GridItem area="copyright" bg="green">
        Footer
      </GridItem>
    </Grid>
  );
}

export default App;
