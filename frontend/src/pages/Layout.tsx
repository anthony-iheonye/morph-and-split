import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const Layout = () => {
  return (
    <Grid
      templateAreas={{
        base: `"nav"
                   "outlet"`,
        md: `"nav outlet"`,
      }}
      templateColumns={{
        base: "1fr",
        md: "65px 1fr",
      }}
    >
      <GridItem area="nav">
        <NavBar />
      </GridItem>

      <GridItem area="outlet">
        <Box>
          <Outlet />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default Layout;
