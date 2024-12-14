import {
  Box,
  IconButton,
  PlacementWithLogical,
  Tooltip,
} from "@chakra-ui/react";
import { Link, To } from "react-router-dom";
import { useNavIconColor } from "../../../hooks";

interface Props {
  to: To;
  tooltipLabel?: string;
  icon: React.ReactElement;
  iconLabel: string;
  backgroundColor?: string;
  tooltipPlacement?: PlacementWithLogical;
}

const MainNavBarItem = ({
  to,
  icon,
  iconLabel,
  backgroundColor,
  tooltipLabel,
  tooltipPlacement = "top-start",
}: Props) => {
  const colorScheme = useNavIconColor();
  return (
    <Box width="auto" alignSelf="center">
      <Link to={to}>
        <Tooltip label={tooltipLabel} placement={tooltipPlacement}>
          <IconButton
            aria-label={iconLabel}
            icon={icon}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorScheme}
            backgroundColor={backgroundColor}
          />
        </Tooltip>
      </Link>
    </Box>
  );
};

export default MainNavBarItem;
