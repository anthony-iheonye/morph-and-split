import { Box, Image } from "@chakra-ui/react";
import logo from "../../assets/logo.svg";

/**
 * CompanyLogo renders the company logo image centered within its container. *
 */
const CompanyLogo = () => {
  return (
    <Box width="auto" alignSelf="center">
      <Image src={logo} boxSize="60px" objectFit="contain" />
    </Box>
  );
};

export default CompanyLogo;
