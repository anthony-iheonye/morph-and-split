import { Select } from "@chakra-ui/react";
import { useAugConfigAndSetter } from "../../hooks";

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
