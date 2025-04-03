import { MouseEvent } from "react";

interface HandleLinkClickProps {
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

/**
 * Conditionally handles anchor tag clicks by:
 * - Preventing navigation if the link is disabled.
 * - Invoking a custom `onClick` handler if provided and not disabled.
 *
 * @param event - The mouse click event on the anchor element.
 * @param param1 - Destructured props containing `disabled` and optional `onClick` handler.
 */
const handleLinkClick = (
  event: MouseEvent<HTMLAnchorElement>,
  { disabled, onClick }: HandleLinkClickProps
) => {
  if (disabled) {
    event.preventDefault(); // Prevent default link behavior
    return;
  }

  if (onClick) {
    onClick(event); // Call the provided onClick handler
  }
};

export default handleLinkClick;
