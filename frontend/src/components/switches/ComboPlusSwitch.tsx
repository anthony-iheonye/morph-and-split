import { HStack, Switch } from "@chakra-ui/react";
import { ReactNode } from "react";
import { IconType } from "react-icons";
import { useAugConfigAndSetter } from "../../hooks";
import { IconHeadingDescriptionCombo } from "../miscellaneous";

/**
 * Props for the ComboPlusSwitch component.
 */
interface Props {
  /** Header text to be displayed beside the switch */
  header: string;
  /** Optional ReactNode element to be used as a switch (not currently used in this implementation) */
  switch: ReactNode;
  /** Key representing the specific transformation toggle in the augConfig state */
  transformName:
    | "randomCrop"
    | "flipUpDown"
    | "flipLeftRight"
    | "randomRotate"
    | "corruptBrightness"
    | "corruptContrast"
    | "corruptSaturation"
    | "augmentValData";
  /** Optional icon to be shown beside the header and description */
  icon?: IconType | undefined;
  /** Optional margin on the right side of the switch */
  switchRightMargin?: number;
}

/**
 * ComboPlusSwitch component displays an icon-header-description combo with a toggle switch.
 * The switch toggles a specific boolean configuration flag in the augmentation config.
 */
const ComboPlusSwitch = ({
  header,
  transformName,
  icon,
  switchRightMargin = 0,
}: Props) => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  /**
   * Toggles the boolean state of the selected transformation config key.
   * @param key The transformation config key to toggle.
   */
  const handleCheckBoxChange = (key: keyof typeof augConfig) => {
    setAugConfig(key, !augConfig[key]);
  };

  /** Descriptions of each transformation toggle option */
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
      "Apply the selected random transformations to the validation set.",
  };

  return (
    <HStack justify="space-between" align="start" width="100%">
      <IconHeadingDescriptionCombo
        icon={icon}
        title={header}
        description={transforms[transformName]}
      />
      <Switch
        id={transformName}
        colorScheme="teal"
        isChecked={augConfig[transformName]}
        onChange={() => handleCheckBoxChange(transformName)}
        marginRight={switchRightMargin}
      />
    </HStack>
  );
};

export default ComboPlusSwitch;
