import { Select } from "@chakra-ui/react";
import { useAugConfigAndSetter } from "../../hooks";

/**
 * SplitParameterSelector is a dropdown component that allows users to select
 * a visual attribute for stratified splitting.
 *
 * The available attributes are grouped into categories:
 * - Color (L, a, b channels)
 * - Size (e.g., Equivalent Diameter, Perimeter)
 * - Shape (e.g., Eccentricity, Roundness)
 * - Texture (e.g., Contrast, Energy)
 *
 * Upon selection, it updates the `splitParameter` value in the augmentation config.
 */
const SplitParameterSelector = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  const visualAttributes = {
    Color: {
      l: { name: "L (Lightness)", value: "L" },
      a: { name: "a (Green-Red component)", value: "a" },
      b: { name: "b (Blue-Yellow component)", value: "b" },
    },
    Size: {
      equivalentDiameter: {
        name: "Equivalent Diameter",
        value: "equivalent_diameter",
      },
      feretDiameterMax: {
        name: "Feret Diameter",
        value: "feret_diameter_max",
      },
      filledArea: { name: "Filled Area", value: "filled_area" },
      perimeter: { name: "Perimeter", value: "perimeter" },
    },
    Shape: {
      eccentricity: { name: "Eccentricity", value: "eccentricity" },
      roundness: { name: "Roundness", value: "roundness" },
    },
    Texture: {
      contrast: { name: "Contrast", value: "contrast" },
      correlation: { name: "Correlation", value: "Correlation" },
      energy: { name: "Energy", value: "Energy" },
    },
  };

  return (
    <Select
      value={augConfig.splitParameter}
      onChange={(e) => setAugConfig("splitParameter", e.target.value)}
      width="fit-content"
    >
      {Object.entries(visualAttributes).map(([groupName, groupValues]) => (
        <optgroup label={groupName} key={groupName}>
          {Object.entries(groupValues).map(([key, result]) => (
            <option key={key} value={result.value}>
              {result.name}
            </option>
          ))}
        </optgroup>
      ))}
    </Select>
  );
};

export default SplitParameterSelector;
