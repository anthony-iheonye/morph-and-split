import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { UploadDataBar } from "../components/navigation/subNavBars";

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
      height="100%"
      overflow="hidden"
    >
      <GridItem area="upload_bar">
        <UploadDataBar />
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
          display="flex"
          flexDirection="column"
          marginBottom={"2rem"}
        >
          <Outlet />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default UploadData;
