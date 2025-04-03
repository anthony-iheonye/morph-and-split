import {
  HStack,
  Icon,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import ThemedText from "./ThemedText";

/**
 * Props for the IconHeadingDescriptionCombo component.
 */
interface Props {
  /** Optional icon to display alongside the title */
  icon?: IconType;
  /** Title text or responsive object */
  title?: string | { base?: string; md?: string; lg?: string };
  /** Description text or responsive object */
  description?: string | { base?: string; md?: string; lg?: string };
  /** Font size for the title */
  fontSize?: number | string;
}

/**
 * IconHeadingDescriptionCombo renders an optional icon, a title,
 * and a supporting description in a stacked layout.
 *
 * Responsive values are supported for both title and description.
 * This component is commonly used for labeled controls with tooltips or switches.
 */
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
