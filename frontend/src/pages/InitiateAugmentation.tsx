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
        overflow="hidden"
      >
        <Box
          marginTop={{ base: 5, md: 8 }}
          overflowY="hidden"
          marginBottom={"2rem"}
        >
          <Outlet />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default InitiateAugmentation;
