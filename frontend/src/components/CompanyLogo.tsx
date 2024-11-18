import { Box, Image, Link } from "@chakra-ui/react";
import logo from "../assets/logo.webp";

const CompanyLogo = () => {
  return (
    <Box width="auto" alignSelf="center">
      <Link>
        <Image src={logo} boxSize="60px" objectFit="cover" />
      </Link>
    </Box>
  );
};

export default CompanyLogo;
