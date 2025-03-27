import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components/navigation";
import { parentNames, useActiveParent } from "../hooks";
import WelcomePage from "./WelcomePage";
import { CopyrightBar } from "../components/miscellaneous";
// import FeatureSwitcher from "../components/display/FeatureSwitcher";

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
      height="100dvh" // ensure the layout doesn't grow more than the height of the viewport
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
          md: "80px 1fr",
        }}
        overflow="hidden"
      >
        <GridItem area="nav">
          <NavBar />
        </GridItem>

        <GridItem
          area="outlet"
          display="flex"
          flexDirection="column"
          overflow="hidden"
          height="100%"
        >
          <Box overflow="hidden" position="relative">
            {activeParent === home ? <WelcomePage /> : null}
            <Outlet />
          </Box>
        </GridItem>
      </Grid>
      <CopyrightBar />
    </Box>
  );
};

export default Layout;
