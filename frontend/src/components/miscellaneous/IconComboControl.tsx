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

interface IconComboControlProps extends GridProps {
  title: string;
  titleFontSize?: number | { base?: number; md?: number; lg?: number };
  description?: string | { base?: string; md?: string; lg?: string };
  icon?: IconType | undefined;
  controlElement?: ReactNode;
  controlElementWidth?: number | string | {};
}
const IconComboControl = ({
  icon,
  title,
  description = "",
  titleFontSize = 16,
  controlElement,
  controlElementWidth = "auto",
  ...rest
}: IconComboControlProps) => {
  const responsiveTitle = useBreakpointValue(
    typeof title === "string" ? { base: title } : title
  );

  const responsiveDescription = useBreakpointValue(
    typeof description === "string" ? { base: description } : description
  );

  return (
    <Grid
      templateAreas={{
        base: `"iconHeading switch"
                   "description description"`,
        md: `"iconHeading switch"
                   "description ."`,
      }}
      templateColumns={{
        base: `1fr ${controlElementWidth}`,
        md: `1fr ${controlElementWidth}`,
      }}
      {...rest}
    >
      <GridItem area="iconHeading">
        <HStack>
          {icon ? <Icon as={icon} boxSize={8} /> : null}
          <Text mb={0} fontSize={titleFontSize} fontWeight="medium">
            {responsiveTitle}
          </Text>
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
      </GridItem>
    </Grid>
  );
};

export default IconComboControl;
