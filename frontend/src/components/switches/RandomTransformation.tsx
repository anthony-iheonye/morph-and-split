import { GridProps, Switch, useBreakpointValue } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { useAugConfigAndSetter } from "../../hooks";
import { IconComboControl } from "../miscellaneous";

interface Props extends Omit<GridProps, "title"> {
  title: string | { base?: string; md?: string; lg?: string };
  titleFontSize?: number | { base?: number; md?: number; lg?: number };
  description?: string | { base?: string; md?: string; lg?: string };
  transformName:
    | "randomCrop"
    | "flipUpDown"
    | "flipLeftRight"
    | "randomRotate"
    | "corruptBrightness"
    | "corruptContrast"
    | "corruptSaturation"
    | "augmentValData";
  icon?: IconType | undefined;
  switchRightMargin?: number;
}
const RandomTransformation = ({
  title,
  titleFontSize,
  description = "",
  transformName,
  icon,
  switchRightMargin = 0,
}: Props) => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  const responsiveDescription = useBreakpointValue(
    typeof description === "string" ? { base: description } : description
  );

  const responsiveTitle =
    useBreakpointValue(typeof title === "string" ? { base: title } : title) ||
    "";

  const handleCheckBoxChange = (key: keyof typeof augConfig) => {
    setAugConfig(key, !augConfig[key]);
  };

  const transforms = {
    randomCrop:
      "Randomly selects a portion of the image to crop, resizing it to the original dimensions.",
    flipUpDown:
      "Flips the image vertically, creating a mirrored version along the horizontal axis.",
    flipLeftRight:
      "Flips the image horizontally, creating a mirrored version along the vertical axis.",
    randomRotate:
      "Rotates the image by a random angle to introduce rotation variance.",
    corruptBrightness:
      "Adjusts the brightness level randomly to simulate varying lighting conditions.",
    corruptContrast:
      "Modifies the contrast of the image to enhance or reduce color distinctions.",
    corruptSaturation:
      "Alters the intensity of colors to simulate different saturation levels.",
    augmentValData:
      "Apply selected transformations to validation and test sets.",
  };

  return (
    <IconComboControl
      icon={icon}
      title={responsiveTitle}
      description={transforms[transformName] || responsiveDescription}
      titleFontSize={titleFontSize}
      controlElement={
        <Switch
          id={transformName}
          colorScheme="teal"
          isChecked={augConfig[transformName]}
          onChange={() => handleCheckBoxChange(transformName)}
          marginRight={switchRightMargin}
        />
      }
    />
  );
};

export default RandomTransformation;
