import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import useBoundingBoxColor from "../hooks/useBoundingBoxColor";

interface Props {
  children: ReactNode;
}

const BoundingBox = ({ children }: Props) => {
  const backgroundColor = useBoundingBoxColor();

  return (
    <Box
      padding={5}
      margin={4}
      borderRadius={4}
      backgroundColor={backgroundColor}
    >
      {children}
    </Box>
  );
};

export default BoundingBox;
