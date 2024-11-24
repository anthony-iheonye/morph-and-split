import { Box, Image } from "@chakra-ui/react";
import logo from "../assets/logo.webp";

const CompanyLogo = () => {
  return (
    <Box width="auto" alignSelf="center">
      <Image src={logo} boxSize="60px" objectFit="cover" />
    </Box>
  );
};

export default CompanyLogo;
