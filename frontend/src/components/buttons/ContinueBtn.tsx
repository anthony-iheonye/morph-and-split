import { Button, useBreakpointValue } from "@chakra-ui/react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

/**
 * Props for the ContinueBtn component.
 *
 * @property {string | { base?: string; md?: string; lg?: string }} [label="Continue"] -
 * Optional button label, either as a static string or responsive object with labels per breakpoint.
 * @property {string} to - The target route to navigate to when clicked.
 * @property {boolean} [disable=false] - Flag to enable or disable the button.
 */
interface Props {
  label?: string | { base?: string; md?: string; lg?: string };
  to: string;
  disable?: boolean;
}

/**
 * ContinueBtn component renders a responsive button for navigation purposes.
 *
 * @param {Props} props - Component props.
 * @returns {JSX.Element} The configured Chakra UI button with responsive label.
 */
const ContinueBtn = ({ to, label = "Continue", disable = false }: Props) => {
  const navigate = useNavigate();

  // Determine label based on screen size (responsive).
  const responsiveLabel = useBreakpointValue(
    typeof label === "string" ? { base: label } : label
  );

  return (
    <Button
      colorScheme="teal"
      size="sm"
      onClick={() => navigate(to)}
      borderRadius={20}
      rightIcon={<IoIosArrowForward />}
      isDisabled={disable}
    >
      {responsiveLabel}
    </Button>
  );
};

export default ContinueBtn;
