import { Box, Image } from "@chakra-ui/react";
import logo from "../assets/logo.webp";
import useActiveParent from "../hooks/useActiveParent";
import { parentNames } from "../store/navStore";

const CompanyLogo = () => {
  const { setActiveParent } = useActiveParent();
  const parentName = parentNames.uploadImageAndMask;

  return (
    <Box
      width="auto"
      alignSelf="center"
      onClick={() => setActiveParent(parentName)}
    >
      <Image src={logo} boxSize="60px" objectFit="cover" />
    </Box>
  );
};

export default CompanyLogo;
