import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useBoundingBoxColor } from "../../hooks";

/**
 * Props for the BoundingBox component.
 */
interface Props extends BoxProps {
  /** Elements to be rendered inside the bounding box. */
  children: ReactNode;
  /** If true, sets the background to transparent instead of themed color. */
  transparent?: boolean;
}

/**
 * BoundingBox is a layout wrapper component that applies consistent spacing,
 * padding, and optional background color to its children.
 *
 * It uses Chakra UI's Box component and integrates theme-based background coloring
 * via the useBoundingBoxColor hook unless `transparent` is true.
 */
const BoundingBox = ({
  children,
  width,
  maxWidth,
  minHeight,
  flex,
  justifySelf,
  display,
  marginLeft = { base: 3.5, md: 4 },
  marginRight = { base: 3.5, md: 4 },
  marginTop = { base: 3.5, md: 4 },
  marginBottom = "0",
  padding = { base: 3.5, md: 4 },
  maxHeight = "none",
  overflowY = undefined,
  borderRadius = 4,
  transparent = false,
  ...rest
}: Props) => {
  const backgroundColor = useBoundingBoxColor();

  return (
    <Box
      padding={padding}
      borderRadius={borderRadius}
      backgroundColor={transparent ? "transparent" : backgroundColor}
      maxHeight={maxHeight}
      minHeight={minHeight}
      overflow={overflowY}
      flex={flex}
      width={width}
      maxWidth={maxWidth}
      justifySelf={justifySelf}
      display={display}
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginTop={marginTop}
      marginBottom={marginBottom}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default BoundingBox;
