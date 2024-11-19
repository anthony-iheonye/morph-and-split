import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import useBoundingBoxColor from "../hooks/useBoundingBoxColor";

interface Props {
  children: ReactNode;
  maxHeight?: string | { base?: string; md?: string; lg?: string };
  flex?: string;
  overflowY?:
    | "auto"
    | "clip"
    | "hidden"
    | "scroll"
    | "unset"
    | "visible"
    | { base?: string; md?: string; lg?: string };
}

const BoundingBox = ({
  children,
  flex,
  maxHeight = "none",
  overflowY = undefined,
}: Props) => {
  const backgroundColor = useBoundingBoxColor();

  return (
    <Box
      padding={5}
      margin={4}
      borderRadius={4}
      backgroundColor={backgroundColor}
      maxHeight={maxHeight}
      overflow={overflowY}
      flex={flex}
    >
      {children}
    </Box>
  );
};

export default BoundingBox;
