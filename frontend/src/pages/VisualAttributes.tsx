import { HStack, VStack, Switch, SimpleGrid } from "@chakra-ui/react";
import { BiSolidArea } from "react-icons/bi";
import { BsFiletypeCsv } from "react-icons/bs";
import { FaCircleNotch } from "react-icons/fa6";
import { GiRollingEnergy } from "react-icons/gi";
import { GoCircleSlash } from "react-icons/go";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { IoColorPaletteSharp } from "react-icons/io5";
import { MdOutlineContrast } from "react-icons/md";
import { RxDimensions } from "react-icons/rx";
import { TbTexture, TbOvalVertical } from "react-icons/tb";
import {
  VisualAttributeFilePicker,
  PreviousBtn,
  ContinueBtn,
} from "../components/buttons";
import { BoundingBox } from "../components/display";
import { SplitParameterSelector } from "../components/dropdowns";
import {
  PageTitle,
  IconHeadingDescriptionCombo,
  IconComboControl,
} from "../components/miscellaneous";
import { useAugConfigAndSetter } from "../hooks";
import { VisualAttributeSwitch } from "../components/switches";

const VisualAttributes = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  const handleCheckBoxChange = (key: keyof typeof augConfig) => {
    setAugConfig(key, !augConfig[key]);
  };

  const transforms = {
    eccentricity: "Measures how elongated an object is",
    equivalentDiameter:
      "Diameter of a circle with the same area as the object.",
    feretDiameterMax:
      "The maximum distance between any two points on the object's boundary.",
    filledArea: "The total area of the segmented object.",
    perimeter: "The length of the object's boundary.",
    roundness: "Measures how circular an object is.",
    l: "Indicates the brightness of the object.",
    a: "Measures the green to red color balance.",
    b: "Measures the blue to yellow color balance.",
    contrast:
      "The difference in intensity or color between the object and background.",
    correlation:
      "Measures the relationship between pixel values and neighbors.",
    energy:
      "Indicates texture uniformity, with higher values showing less complexity.",
  };
  return (
    <>
      <PageTitle title="Visual Attributes" />
      <BoundingBox>
        <IconComboControl
          icon={HiOutlineArrowsExpand}
          title="Stratified Split Parameter"
          description={{
            base: "Select the split parameter to ensure consistent class distribution across training, validation, and test sets.",
          }}
          controlElement={<SplitParameterSelector />}
          contolElementWidth="100px"
        />
      </BoundingBox>

      <BoundingBox>
        <IconComboControl
          icon={BsFiletypeCsv}
          title="Upload Visual Attribute Data"
          description={{
            md: "Select the CSV file containing the visual attributes of the food in the image.",
          }}
          controlElement={<VisualAttributeFilePicker />}
        />
      </BoundingBox>

      <BoundingBox overflowY="auto" maxHeight={{ base: "300px", md: "57vh" }}>
        <SimpleGrid columns={{ base: 1 }} spacing={{ base: 8, md: 8 }}>
          <VisualAttributeSwitch
            attributeName="l"
            icon={IoColorPaletteSharp}
            title="L (Lightness)"
          />

          <VisualAttributeSwitch
            attributeName="a"
            icon={IoColorPaletteSharp}
            title="a (Green-Red Index)"
          />

          <VisualAttributeSwitch
            attributeName="b"
            icon={IoColorPaletteSharp}
            title="b (Blue-Yellow index)"
          />

          <VisualAttributeSwitch
            attributeName="contrast"
            icon={MdOutlineContrast}
            title="Contrast"
          />

          <VisualAttributeSwitch
            attributeName="correlation"
            icon={TbTexture}
            title="Correlation"
          />

          <VisualAttributeSwitch
            attributeName="energy"
            icon={GiRollingEnergy}
            title="Energy"
          />

          <VisualAttributeSwitch
            attributeName="feretDiameterMax"
            icon={GoCircleSlash}
            title="Ferret Diameter"
          />

          <VisualAttributeSwitch
            attributeName="filledArea"
            icon={BiSolidArea}
            title="Filled Area"
          />

          <VisualAttributeSwitch
            attributeName="perimeter"
            icon={RxDimensions}
            title="Perimeter"
          />

          <VisualAttributeSwitch
            attributeName="eccentricity"
            icon={TbOvalVertical}
            title="Eccentricity"
          />

          <VisualAttributeSwitch
            attributeName="feretDiameterMax"
            icon={GoCircleSlash}
            title="Ferret Diameter"
          />

          <VisualAttributeSwitch
            attributeName="roundness"
            icon={FaCircleNotch}
            title="Roundness"
          />
        </SimpleGrid>

        {/* <VStack spacing={8}>
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={IoColorPaletteSharp}
              title="a (Green-Red Component)"
              description={transforms.a}
            />
            <Switch
              id="a"
              colorScheme="teal"
              isChecked={augConfig.a}
              onChange={() => handleCheckBoxChange("a")}
            />
          </HStack>

          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={IoColorPaletteSharp}
              title="b (Blue-Yellow Component)"
              description={transforms.b}
            />
            <Switch
              id="b"
              colorScheme="teal"
              isChecked={augConfig.b}
              onChange={() => handleCheckBoxChange("b")}
            />
          </HStack>

          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={MdOutlineContrast}
              title="Contrast"
              description={transforms.contrast}
            />
            <Switch
              id="contrast"
              colorScheme="teal"
              isChecked={augConfig.contrast}
              onChange={() => handleCheckBoxChange("contrast")}
            />
          </HStack>

          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={TbTexture}
              title="Correlation"
              description={transforms.correlation}
            />
            <Switch
              id="correlation"
              colorScheme="teal"
              isChecked={augConfig.correlation}
              onChange={() => handleCheckBoxChange("correlation")}
            />
          </HStack>

          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={GiRollingEnergy}
              title="Energy"
              description={transforms.energy}
            />
            <Switch
              id="energy"
              colorScheme="teal"
              isChecked={augConfig.energy}
              onChange={() => handleCheckBoxChange("energy")}
            />
          </HStack>

          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={GoCircleSlash}
              title="Ferret Diameter"
              description={transforms.feretDiameterMax}
            />
            <Switch
              id="feretDiameterMax"
              colorScheme="teal"
              isChecked={augConfig.feretDiameterMax}
              onChange={() => handleCheckBoxChange("feretDiameterMax")}
            />
          </HStack>

          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={BiSolidArea}
              title="Filled Area"
              description={transforms.filledArea}
            />
            <Switch
              id="filledArea"
              colorScheme="teal"
              isChecked={augConfig.filledArea}
              onChange={() => handleCheckBoxChange("filledArea")}
            />
          </HStack>

          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={RxDimensions}
              title="Perimeter"
              description={transforms.perimeter}
            />
            <Switch
              id="perimeter"
              colorScheme="teal"
              isChecked={augConfig.perimeter}
              onChange={() => handleCheckBoxChange("perimeter")}
            />
          </HStack>

          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={TbOvalVertical}
              title="Eccentricity"
              description={transforms.eccentricity}
            />
            <Switch
              id="eccentricity"
              colorScheme="teal"
              isChecked={augConfig.eccentricity}
              onChange={() => handleCheckBoxChange("eccentricity")}
            />
          </HStack>

          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={FaCircleNotch}
              title="Roundness"
              description={transforms.roundness}
            />
            <Switch
              id="roundness"
              colorScheme="teal"
              isChecked={augConfig.roundness}
              onChange={() => handleCheckBoxChange("roundness")}
            />
          </HStack>
        </VStack> */}
      </BoundingBox>

      <BoundingBox transparent padding={0}>
        <HStack justifyContent={{ base: "center", md: "start" }}>
          <PreviousBtn to="/settings/select_transformation" />
          <ContinueBtn to="/settings/pre_processing" />
        </HStack>
      </BoundingBox>
    </>
  );
};

export default VisualAttributes;
