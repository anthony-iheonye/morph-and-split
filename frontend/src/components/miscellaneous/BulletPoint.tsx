import { ListIcon, ListItem } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

/**
 * BulletPoint is a reusable list item component that displays a teal check icon.
 *
 * Typically used within a Chakra UI <List> component to visually indicate
 * completed features, benefits, or checklist items.
 */
const BulletPoint = () => {
  return (
    <ListItem>
      <ListIcon as={FaCheckCircle} color="teal.500" />
    </ListItem>
  );
};

export default BulletPoint;
