import {
  FormControl,
  FormLabel,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
} from "@chakra-ui/react";
import useAugConfigStore from "../store";
import BoundingBox from "../components/BoundingBox";

const adjustRatios = (
  train: number,
  val: number,
  test: number,
  changedKey: "train" | "val" | "test",
  newValue: number
) => {
  let remaining = 1 - newValue;

  if (changedKey === "train") {
    if (val + test === 0) {
      val = remaining / 2;
      test = remaining / 2;
    } else {
      val = (val / (val + test)) * remaining;
      test = remaining - val;
    }
    return { train: newValue, val, test };
  } else if (changedKey === "val") {
    if (train + test === 0) {
      train = remaining / 2;
      test = remaining / 2;
    } else {
      train = (train / (train + test)) * remaining;
      test = remaining - train;
    }
    return { train, val: newValue, test };
  } else {
    if (val + train === 0) {
      val = remaining / 2;
      train = remaining / 2;
    } else {
      train = (train / (train + val)) * remaining;
      val = remaining - train;
    }
    return { train, val, test: newValue };
  }
};

interface Props {
  labelweight:
    | "normal"
    | "black"
    | "hairline"
    | "thin"
    | "light"
    | "medium"
    | "semibold"
    | "extrabold";
}
const DataSplitterSlider = ({ labelweight = "normal" }: Props) => {
  const { augConfig, setRatios } = useAugConfigStore((store) => ({
    augConfig: store.augConfig,
    setRatios: store.setRatios,
  }));

  const trainRatio = augConfig.trainRatio;
  const valRatio = augConfig.valRatio;
  const testRatio = augConfig.testRatio;

  const handleChange = (
    changedKey: "train" | "val" | "test",
    newValue: number
  ) => {
    const { train, val, test } = adjustRatios(
      augConfig.trainRatio,
      augConfig.valRatio,
      augConfig.testRatio,
      changedKey,
      newValue
    );
    setRatios(train, val, test);
  };
  const mb = "3px";

  return (
    <BoundingBox>
      <Text color={"gray.400"} mb={4} fontSize="sm">
        Select the split percentage for the training, validation and test sets.
      </Text>
      <VStack spacing={{ base: 5, lg: 4 }}>
        {/*Training Slider*/}
        <FormControl>
          <FormLabel fontWeight={labelweight} marginBottom={mb}>
            Training split ({(trainRatio * 100).toFixed(1)}%)
          </FormLabel>
          <Slider
            value={trainRatio}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => handleChange("train", value)}
          >
            <SliderTrack bg="teal.100">
              <SliderFilledTrack bg="teal.500" />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
        </FormControl>

        {/* Validation Split slider */}
        <FormControl>
          <FormLabel fontWeight={labelweight} marginBottom={mb}>
            Validation split ({(valRatio * 100).toFixed(1)}%)
          </FormLabel>
          <Slider
            value={valRatio}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => handleChange("val", value)}
          >
            <SliderTrack bg="orange.200">
              <SliderFilledTrack bg="orange.500" />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
        </FormControl>

        {/* Testing Split slider */}
        <FormControl>
          <FormLabel fontWeight={labelweight} marginBottom={mb}>
            Testing split ({(testRatio * 100).toFixed(1)}%)
          </FormLabel>
          <Slider
            value={testRatio}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => handleChange("test", value)}
          >
            <SliderTrack bg="green.200">
              <SliderFilledTrack bg="green.500" />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
        </FormControl>
      </VStack>
    </BoundingBox>
  );
};

export default DataSplitterSlider;
