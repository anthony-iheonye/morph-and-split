import { Button, useBreakpointValue } from "@chakra-ui/react";
import { AiOutlineCloseSquare } from "react-icons/ai";

interface Props {
  label?: string | { base?: string; md?: string; lg?: string };
  disable?: boolean;
}

const EndSession = ({ label = "End session", disable = false }: Props) => {
  const responsiveLabel = useBreakpointValue(
    typeof label === "string" ? { base: label } : label
  );

  return (
    <Button
      colorScheme="red"
      size="sm"
      borderRadius={20}
      leftIcon={<AiOutlineCloseSquare />}
      isDisabled={disable}
    >
      {responsiveLabel}
    </Button>
  );
};

export default EndSession;
