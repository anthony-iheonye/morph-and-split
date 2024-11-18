import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import AugSettingBar from "../components/AugSettingBar";

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
    >
      <GridItem area="settings">
        <AugSettingBar />
      </GridItem>

      <GridItem area="outlet">
        <Box marginTop={8}>
          <Outlet />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default AugmentationSettings;
