import {
  Grid,
  GridItem,
  GridProps,
  HStack,
  Icon,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { IconType } from "react-icons";
import ThemedText from "./ThemedText";

/**
 * Props for the IconComboControl component, which includes optional icon, responsive title,
 * description, control element, and layout adjustments.
 */
interface IconComboControlProps extends Omit<GridProps, "title"> {
  title: string | { base?: string; md?: string; lg?: string };
  titleFontSize?: number | { base?: number; md?: number; lg?: number };
  description?: string | { base?: string; md?: string; lg?: string };
  leftAlignDescription?: boolean;
  icon?: IconType | undefined;
  controlElement?: ReactNode;
  controlElementWidth?: number | string | {};
  titleHint?: JSX.Element;
}

/**
 * IconComboControl is a responsive layout component that displays an icon, title,
 * optional description, and a right-aligned control element (like a toggle or input).
 *
 * It adapts its grid layout based on screen size and allows for alignment configuration
 * of the description. The component is typically used for labeled settings sections.
 */
const IconComboControl = ({
  icon,
  title,
  description = "",
  leftAlignDescription = true,
  titleFontSize = 16,
  controlElement,
  controlElementWidth = "auto",
  titleHint,
  ...rest
}: IconComboControlProps) => {
  const responsiveTitle = useBreakpointValue(
    typeof title === "string" ? { base: title } : title
  );

  const responsiveDescription = useBreakpointValue(
    typeof description === "string" ? { base: description } : description
  );

  const cell = leftAlignDescription ? "." : "description";

  return (
    <Grid
      templateAreas={{
        base: `"iconHeading switch"
               "description description"`,

        md: `"iconHeading switch"
             "description ${cell}"`,
      }}
      templateColumns={{
        base: `1fr ${controlElementWidth}`,
        md: `1fr ${controlElementWidth}`,
      }}
      width="100%"
      {...rest}
    >
      <GridItem area="iconHeading">
        <HStack>
          {icon ? <Icon as={icon} boxSize={8} /> : null}
          <Text mb={0} fontSize={titleFontSize} fontWeight="medium">
            {responsiveTitle}
          </Text>
          {titleHint}
        </HStack>
      </GridItem>

      <GridItem
        area="switch"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        marginLeft={3}
      >
        {controlElement && controlElement}
      </GridItem>

      <GridItem area="description">
        <ThemedText
          fontSize="sm"
          mb={0}
          mt={0.6}
          lineHeight="17px"
          marginRight={{ base: 2, md: 6 }}
          marginTop={1}
        >
          {responsiveDescription}
        </ThemedText>
      </GridItem>
    </Grid>
  );
};

export default IconComboControl;
