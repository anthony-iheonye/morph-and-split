import { Flex, Heading } from "@chakra-ui/react";
import { FaMagic } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { PiCirclesThreeFill, PiResizeBold } from "react-icons/pi";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
  useBoundingBoxColor,
} from "../../../hooks";
import { SubNavBarItem } from "../subNavItems";

const AugSettingBar = () => {
  const backgroundColor = useBoundingBoxColor();
  const { subParentColor } = useActiveNavColor();

  const activeSubParent = useActiveSubParent();
  const { dataSplit, transformation, visualAtttributes, preProcessing } =
    subParentNames;

  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100vh" }}
      minHeight={{ md: "100%" }}
      padding="10px"
      gap={{ md: 7 }}
      bg={backgroundColor}
      justifyContent={{ base: "space-between", md: "flex-start" }}
    >
      <Heading as="h2" fontWeight={500} padding={2}>
        Settings
      </Heading>

      <SubNavBarItem
        icon={<PiCirclesThreeFill />}
        iconLabel="Split data into train, val and test sets."
        text={{ md: "Data Split" }}
        to={"/settings/data_split"}
        backgroundColor={
          activeSubParent === dataSplit ? subParentColor : "transparent"
        }
        tooltipLabel="Split data into train, val and test sets"
      />

      <SubNavBarItem
        icon={<FaMagic />}
        iconLabel="Apply random transformations."
        text={{ md: "Transformations" }}
        to={"/settings/select_transformation"}
        backgroundColor={
          activeSubParent === transformation ? subParentColor : "transparent"
        }
        tooltipLabel="Select transformations"
      />

      <SubNavBarItem
        icon={<IoIosColorPalette />}
        iconLabel="Select visual attributes JSON file"
        text={{ md: "Visual attributes" }}
        to={"/settings/visual_attributes"}
        backgroundColor={
          activeSubParent === visualAtttributes ? subParentColor : "transparent"
        }
        tooltipLabel="Select visual attribute file"
      />

      <SubNavBarItem
        icon={<PiResizeBold />}
        iconLabel="Set image and mask preprocessing configuration."
        text={{ md: "Pre-processing" }}
        to={"/settings/pre_processing"}
        backgroundColor={
          activeSubParent === preProcessing ? subParentColor : "transparent"
        }
        tooltipLabel="Apply pre-processing steps"
      />
    </Flex>
  );
};

export default AugSettingBar;
