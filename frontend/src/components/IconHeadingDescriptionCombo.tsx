import { FormLabel, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface Props {
  icon?: IconType;
  title?: string;
  description?: string;
  fontSize?: number | string;
}
const IconHeadingDescriptionCombo = ({
  icon,
  title,
  description,
  fontSize,
}: Props) => {
  return (
    <VStack spacing={0} align="start">
      <HStack>
        {icon ? <Icon as={icon} boxSize={8} /> : null}
        <FormLabel mb={0} fontSize={fontSize}>
          {title}
        </FormLabel>
      </HStack>
      <Text
        fontSize="sm"
        fontWeight="thin"
        mb={0}
        mt={0.6}
        lineHeight="17px"
        color="gray.400"
      >
        {description}
      </Text>
    </VStack>
  );
};

export default IconHeadingDescriptionCombo;
