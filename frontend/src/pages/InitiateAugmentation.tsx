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
      height="100%"
      overflow="hidden"
    >
      <GridItem area="augment">
        <AugmentBar />
      </GridItem>

      <GridItem
        area="outlet"
        display="flex"
        flexDirection="column"
        flex="1"
        overflow="hidden"
      >
        <Box marginTop={8} overflow="auto" height="100%">
          <Outlet />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default InitiateAugmentation;
