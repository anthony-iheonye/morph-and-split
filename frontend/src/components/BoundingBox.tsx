import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import useBoundingBoxColor from "../hooks/useBoundingBoxColor";

interface Props {
  children: ReactNode;
  maxHeight?: string | { base?: string; md?: string; lg?: string };
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
}

const BoundingBox = ({
  children,
  width,
  maxWidth,
  flex,
  justify,
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
      overflow={overflowY}
      flex={flex}
      width={width}
      maxWidth={maxWidth}
      justifySelf={justify}
    >
      {children}
    </Box>
  );
};

export default BoundingBox;
