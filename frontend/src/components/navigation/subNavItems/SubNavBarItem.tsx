import {
  HStack,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { Link, To } from "react-router-dom";

interface Props {
  text: string;
  to: To;
  onClick: React.MouseEventHandler<HTMLAnchorElement> | undefined;
  tooltipLabel: string;
  icon: React.ReactElement;
  iconLabel: string;
  backgroundColor: string;
}

const SubNavBarItem = ({
  text,
  to,
  onClick,
  tooltipLabel,
  icon,
  iconLabel,
  backgroundColor,
}: Props) => {
  const { colorMode } = useColorMode();

  return (
    <Link to={to} onClick={onClick}>
      <Tooltip label={tooltipLabel} placement="top-start">
        <HStack gap={0} backgroundColor={backgroundColor}>
          <IconButton
            aria-label={iconLabel}
            icon={icon}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorMode === "dark" ? "yellow" : "teal"}
          />
          <Text>{text}</Text>
        </HStack>
      </Tooltip>
    </Link>
  );
};

export default SubNavBarItem;
