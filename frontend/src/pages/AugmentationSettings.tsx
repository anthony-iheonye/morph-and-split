import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { AugSettingBar } from "../components/navigation/subNavBars";

const AugmentationSettings = () => {
  return (
    <Grid
      templateAreas={{
        base: `"settings"
               "outlet"`,
        md: `"settings outlet"`,
      }}
      templateColumns={{
        base: "1fr",
        md: "200px 1fr",
      }}
      height="100%"
      overflow="hidden"
    >
      <GridItem area="settings">
        <AugSettingBar />
      </GridItem>

      <GridItem
        area="outlet"
        display="flex"
        flexDirection="column"
        overflow="auto" // Allows content scrolling when needed
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

export default AugmentationSettings;
