import { HStack, SimpleGrid } from "@chakra-ui/react";
import { BiSolidArea } from "react-icons/bi";
import { BsFiletypeCsv } from "react-icons/bs";
import { FaCircleNotch } from "react-icons/fa6";
import { GiRollingEnergy } from "react-icons/gi";
import { GoCircleSlash } from "react-icons/go";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { IoColorPaletteSharp } from "react-icons/io5";
import { MdOutlineContrast } from "react-icons/md";
import { RxDimensions } from "react-icons/rx";
import { TbOvalVertical, TbTexture } from "react-icons/tb";
import {
  ContinueBtn,
  PreviousBtn,
  VisualAttributeFilePicker,
} from "../components/buttons";
import { BoundingBox } from "../components/display";
import { SplitParameterSelector } from "../components/dropdowns";
import { IconComboControl, PageTitle } from "../components/miscellaneous";
import { VisualAttributeSwitch } from "../components/switches";

const VisualAttributes = () => {
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
          controlElementWidth="100px"
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
