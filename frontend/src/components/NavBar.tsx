import { HStack } from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import CompanyLogo from "./CompanyLogo";

const NavBar = () => {
  return (
    <HStack justifyContent="space-between">
      <CompanyLogo />
      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
