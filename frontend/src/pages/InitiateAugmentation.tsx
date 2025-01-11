import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { AugmentBar } from "../components/navigation/subNavBars";

const InitiateAugmentation = () => {
  return (
    <Grid
      templateAreas={{
        base: `"augment"
               "outlet"`,
        md: `"augment outlet"`,
      }}
      templateColumns={{
        base: "1fr",
        md: "200px 1fr",
      }}
    >
      <GridItem area="augment">
        <AugmentBar />
      </GridItem>

      <GridItem area="outlet">
        <Box marginTop={8}>
          <Outlet />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default InitiateAugmentation;
