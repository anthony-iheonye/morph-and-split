import { MouseEvent } from "react";

interface HandleLinkClickProps {
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

/**
 * A function that controls if a link is disabled or not.
 * @param event
 * @param param1
 * @returns
 */
const handleLinkClick = (
  event: MouseEvent<HTMLAnchorElement>,
  { disabled, onClick }: HandleLinkClickProps
) => {
  if (disabled) {
    event.preventDefault(); // prevent navigation
    return;
  }

  if (onClick) {
    onClick(event); // Call the custom onClick handler if provided.
  }
};

export default handleLinkClick;
