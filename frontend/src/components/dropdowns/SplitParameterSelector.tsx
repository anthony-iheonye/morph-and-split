import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import {
  useAugConfigAndSetter,
  useButtonThemedColor,
  useStratifiedSplitParameters,
} from "../../hooks";

const SplitParameterSelector = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
  const { data } = useStratifiedSplitParameters();

  const {
    backgroundColor,
    borderColor,
    hoverBorder,
    textColor,
    hoverBackgroundColor,
  } = useButtonThemedColor();

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<BsChevronDown />}
        bg={backgroundColor}
        border={`1px solid ${borderColor}`}
        color={textColor}
        transition="background-color 0.2s ease-in-out, border-color 0.2s ease-in-out" //Smooth transitions
        _hover={{
          border: `2px solid ${hoverBorder}`,
          boxShadow: `0 0 0 2px ${hoverBorder}`,
          bg: hoverBackgroundColor,
        }}
        size="md"
      >
        {augConfig.splitParameter ? augConfig.splitParameter : "Parameters"}
      </MenuButton>
      <MenuList maxHeight="50vh" overflowY="auto">
        {data?.results.map((parameter, index) => (
          <MenuItem
            key={index}
            onClick={() => setAugConfig("splitParameter", parameter)}
          >
            {parameter}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default SplitParameterSelector;
