import { ListIcon, ListItem } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

const BulletPoint = () => {
  return (
    <ListItem>
      <ListIcon as={FaCheckCircle} color="teal.500" />
    </ListItem>
  );
};

export default BulletPoint;
