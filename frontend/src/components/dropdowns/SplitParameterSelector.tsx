import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import {
  useAugConfigAndSetter,
  useStratifiedSplitParameters,
} from "../../hooks";

const SplitParameterSelector = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
  const { data } = useStratifiedSplitParameters();

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        {augConfig.splitParameter ? augConfig.splitParameter : "Parameters"}
      </MenuButton>
      <MenuList>
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
