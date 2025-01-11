import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useBoundingBoxColor } from "../../hooks";

interface Props {
  children: ReactNode;
  maxHeight?: string | { base?: string; md?: string; lg?: string };
  minHeight?: string | { base?: string; md?: string; lg?: string };
  flex?: string;
  justify?: string | { base?: string; md?: string; lg?: string };
  borderRadius?: number | string | { base?: string; md?: string; lg?: string };
  padding?: number | string | { base?: string; md?: string; lg?: string };
  overflowY?:
    | "auto"
    | "clip"
    | "hidden"
    | "scroll"
    | "unset"
    | "visible"
    | { base?: string; md?: string; lg?: string };
  width?: string | { base?: string; md?: string; lg?: string };
  maxWidth?: string | { base?: string; md?: string; lg?: string };
  transparent?: boolean;
  display?: string | { base?: string; md?: string; lg?: string };
}

const BoundingBox = ({
  children,
  width,
  maxWidth,
  minHeight,
  flex,
  justify,
  display,
  padding = 5,
  maxHeight = "none",
  overflowY = undefined,
  borderRadius = 4,
  transparent = false,
}: Props) => {
  const backgroundColor = useBoundingBoxColor();

  return (
    <Box
      padding={padding}
      margin={4}
      borderRadius={borderRadius}
      backgroundColor={transparent ? "transparent" : backgroundColor}
      maxHeight={maxHeight}
      minHeight={minHeight}
      overflow={overflowY}
      flex={flex}
      width={width}
      maxWidth={maxWidth}
      justifySelf={justify}
      display={display}
    >
      {children}
    </Box>
  );
};

export default BoundingBox;
