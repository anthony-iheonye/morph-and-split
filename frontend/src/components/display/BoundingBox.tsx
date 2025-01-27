import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useBoundingBoxColor } from "../../hooks";

interface Props extends BoxProps {
  children: ReactNode;
  transparent?: boolean;
}

const BoundingBox = ({
  children,
  width,
  maxWidth,
  minHeight,
  flex,
  justifySelf,
  display,
  marginLeft,
  marginRight,
  padding = { base: 3.5, md: 5 },
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
      margin={4}
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
      {...rest}
    >
      {children}
    </Box>
  );
};

export default BoundingBox;
