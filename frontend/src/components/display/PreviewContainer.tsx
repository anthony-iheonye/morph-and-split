import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

/**
 * Props for the PreviewContainer component.
 */
interface Props {
  /** React children elements to be wrapped within the preview container. */
  children: ReactNode;
}

/**
 * PreviewContainer provides a styled wrapper around preview content.
 *
 * Adds subtle animation and shadow effects on hover to enhance UI interactivity.
 */
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
