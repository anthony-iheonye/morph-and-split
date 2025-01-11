import { Flex, Heading } from "@chakra-ui/react";
import { FaCirclePlay } from "react-icons/fa6";
import { MdGridView } from "react-icons/md";
import {
  useBoundingBoxColor,
  useActiveNavColor,
  useActiveSubParent,
  subParentNames,
} from "../../../hooks";
import { SubNavBarItem } from "../subNavItems";

const AugmentBar = () => {
  const backgroundColor = useBoundingBoxColor();
  const { subParentColor } = useActiveNavColor();

  const activeSubParent = useActiveSubParent();
  const { startAugmentation, previewResult } = subParentNames;

  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100vh" }}
      minHeight={{ md: "100%" }}
      padding="10px"
      gap={{ base: 4, md: 8 }}
      bg={backgroundColor}
      justifyContent={{ base: "space-between", md: "flex-start" }}
    >
      <Heading as="h2" fontWeight={500} padding={2}>
        Augment
      </Heading>

      <SubNavBarItem
        icon={<FaCirclePlay />}
        iconLabel="Apply random transformations to images and their masks."
        text={{ md: "Start Augmentation" }}
        to="/augment/start_augmentation"
        backgroundColor={
          activeSubParent === startAugmentation ? subParentColor : "transparent"
        }
      />

      <SubNavBarItem
        icon={<MdGridView />}
        iconLabel="Preview augmented results."
        text={{ md: "Preview Result" }}
        to="/augment/preview"
        backgroundColor={
          activeSubParent === previewResult ? subParentColor : "transparent"
        }
        tooltipLabel="Preveiw augmentation data"
      />
    </Flex>
  );
};

export default AugmentBar;
