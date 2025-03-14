import {
  HStack,
  Icon,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import ThemedText from "./ThemedText";

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
    <VStack spacing={0} align="start" maxWidth={"auto"}>
      <HStack>
        {icon ? <Icon as={icon} boxSize={8} /> : null}
        <Text mb={0} fontSize={fontSize} fontWeight="medium">
          {responsiveTitle}
        </Text>
      </HStack>

      <ThemedText
        fontSize="sm"
        fontWeight="thin"
        mb={0}
        mt={0.6}
        lineHeight="17px"
        marginRight={{ base: 2, md: 6 }}
      >
        {responsiveDescription}
      </ThemedText>
    </VStack>
  );
};

export default IconHeadingDescriptionCombo;
