import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import UploadDataBar from "../components/bars/UploadDataBar";

const UploadData = () => {
  return (
    <Grid
      templateAreas={{
        base: `"upload_bar"
               "outlet"`,
        md: `"upload_bar outlet"`,
      }}
      templateColumns={{
        base: "1fr",
        md: "200px 1fr",
      }}
    >
      <GridItem area="upload_bar">
        <UploadDataBar />
      </GridItem>

      <GridItem area="outlet">
        <Box marginTop={8}>
          <Outlet />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default UploadData;
