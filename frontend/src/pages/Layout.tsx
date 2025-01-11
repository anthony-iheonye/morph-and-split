import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/navigation/NavBar";

const Layout = () => {
  return (
    <Box
      display="flex"
      maxHeight="100vh"
      flexDirection="column"
      maxWidth="2560px"
      margin="0 auto"
      width="100%"
    >
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
    </Box>
  );
};

export default Layout;
