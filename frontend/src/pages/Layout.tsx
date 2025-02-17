import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components/navigation";
import { parentNames, useActiveParent } from "../hooks";
import WelcomePage from "./WelcomePage";

const Layout = () => {
  const activeParent = useActiveParent();
  const { home } = parentNames;

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      maxWidth="2560px"
      margin="0 auto"
      height="100vh" // ensure the layout doesn't grow more than the height of the viewport
      overflow="hidden"
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
        // height="100%"
        overflow="hidden"
        // flex="1" // ensure the content below takes remaining space
      >
        <GridItem area="nav">
          <NavBar />
        </GridItem>

        <GridItem
          area="outlet"
          display="flex"
          flexDirection="column"
          // flex="1"
          overflow="hidden"
          // height="100%"
        >
          <Box overflow="hidden">
            {activeParent === home ? <WelcomePage /> : null}
            <Outlet />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Layout;
