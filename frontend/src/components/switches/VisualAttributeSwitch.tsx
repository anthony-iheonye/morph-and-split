import { GridProps, Switch, useBreakpointValue } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { useAugConfigAndSetter } from "../../hooks";
import { IconComboControl } from "../miscellaneous";

interface Props extends GridProps {
  title: string;
  titleFontSize?: number | { base?: number; md?: number; lg?: number };
  description?: string | { base?: string; md?: string; lg?: string };
  attributeName:
    | "a"
    | "b"
    | "contrast"
    | "correlation"
    | "eccentricity"
    | "energy"
    | "equivalentDiameter"
    | "feretDiameterMax"
    | "filledArea"
    | "l"
    | "perimeter"
    | "roundness";
  icon?: IconType | undefined;
  switchRightMargin?: number;
}
const VisualAttributeSwitch = ({
  attributeName: attributeName,
  icon,
  title,
  titleFontSize,
  description = "",
  switchRightMargin = 0,
}: Props) => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  const responsiveTitle = useBreakpointValue(
    typeof title === "string" ? { base: title } : title
  );

  const responsiveDescription = useBreakpointValue(
    typeof description === "string" ? { base: description } : description
  );

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

  // Dynamically derive the title if not explicitly provided
  const defaultTitle = {
    eccentricity: "Eccentricity",
    equivalentDiameter: "Equivalent Diameter",
    feretDiameterMax: "Feret Diameter (Max)",
    filledArea: "Filled Area",
    perimeter: "Perimeter",
    roundness: "Roundness",
    l: "Brightness (L*)",
    a: "Green-Red Balance (a*)",
    b: "Blue-Yellow Balance (b*)",
    contrast: "Contrast",
    correlation: "Correlation",
    energy: "Energy",
  }[attributeName];

  return (
    <IconComboControl
      icon={icon}
      title={responsiveTitle || defaultTitle}
      description={transforms[attributeName] || responsiveDescription}
      titleFontSize={titleFontSize}
      controlElement={
        <Switch
          id={attributeName}
          colorScheme="teal"
          isChecked={augConfig[attributeName]}
          onChange={() => handleCheckBoxChange(attributeName)}
          marginRight={switchRightMargin}
        />
      }
    />
  );
};

export default VisualAttributeSwitch;
