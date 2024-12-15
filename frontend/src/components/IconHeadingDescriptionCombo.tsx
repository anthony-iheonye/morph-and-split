import {
  FormLabel,
  HStack,
  Icon,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { IconType } from "react-icons";

interface Props {
  icon?: IconType;
  title?: string | { base?: string; md?: string; lg?: string };
  description?: string | { base?: string; md?: string; lg?: string };
  fontSize?: number | string;
}
const IconHeadingDescriptionCombo = ({
  icon,
  fontSize,
  description = "",
  title = "",
}: Props) => {
  const responsiveTitle = useBreakpointValue(
    typeof title === "string" ? { base: title } : title
  );

  const responsiveDescription = useBreakpointValue(
    typeof description === "string" ? { base: description } : description
  );

  return (
    <VStack spacing={0} align="start">
      <HStack>
        {icon ? <Icon as={icon} boxSize={8} /> : null}
        <Text mb={0} fontSize={fontSize} fontWeight="medium">
          {responsiveTitle}
        </Text>
      </HStack>
      <Text
        fontSize="sm"
        fontWeight="thin"
        mb={0}
        mt={0.6}
        lineHeight="17px"
        color="gray.400"
        marginRight={{ base: 2, md: 6 }}
      >
        {responsiveDescription}
      </Text>
    </VStack>
  );
};

export default IconHeadingDescriptionCombo;
