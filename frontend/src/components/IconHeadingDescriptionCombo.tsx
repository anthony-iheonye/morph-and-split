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
        <FormLabel mb={0} fontSize={fontSize}>
          {responsiveTitle}
        </FormLabel>
      </HStack>
      <Text
        fontSize="sm"
        fontWeight="thin"
        mb={0}
        mt={0.6}
        lineHeight="17px"
        color="gray.400"
      >
        {responsiveDescription}
      </Text>
    </VStack>
  );
};

export default IconHeadingDescriptionCombo;
