import { Button, useBreakpointValue } from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

/**
 * Props for the PreviousBtn component.
 */
interface Props {
  /** Label for the button. Can be a string or a responsive object. */
  label?: string | { base?: string; md?: string; lg?: string };
  /** Destination path to navigate to when the button is clicked. */
  to: string;
  /** Whether the button should be disabled. Default is false. */
  disable?: boolean;
}

/**
 * PreviousBtn is a navigation button that redirects the user to a specified route.
 *
 * It features a left-facing arrow icon and supports responsive label text and disabling logic.
 */
const PreviousBtn = ({ to, label = "Previous", disable = false }: Props) => {
  const navigate = useNavigate();

  /**
   * Resolves the label based on current screen size for responsive display.
   */
  const responsiveLabel = useBreakpointValue(
    typeof label === "string" ? { base: label } : label
  );

  return (
    <Button
      colorScheme="teal"
      size="sm"
      onClick={() => navigate(to)}
      borderRadius={20}
      leftIcon={<IoIosArrowBack />}
      isDisabled={disable}
    >
      {responsiveLabel}
    </Button>
  );
};

export default PreviousBtn;
