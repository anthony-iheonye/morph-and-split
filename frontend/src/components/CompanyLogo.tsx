import { HStack, Image, Text } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import logo from "../assets/logo.webp";

const CompanyLogo = () => {
  return (
    <HStack>
      <Link>
        <Image src={logo} boxSize="60px" objectFit="cover" />
      </Link>
      <Text>FoodLens</Text>
    </HStack>
  );
};

export default CompanyLogo;
