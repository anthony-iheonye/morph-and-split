import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const PreviewContainer = ({ children }: Props) => {
  return (
    <Box
      borderRadius={5}
      overflow="hidden"
      _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
      transition="transform .15s ease-in"
    >
      {children}
    </Box>
  );
};

export default PreviewContainer;
