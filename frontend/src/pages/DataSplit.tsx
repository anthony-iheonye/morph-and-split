import {
  FormControl,
  FormLabel,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaLayerGroup } from "react-icons/fa";
import ContinueBtn from "../components/buttons/ContinueBtn";
import PreviousBtn from "../components/buttons/PreviousBtn";
import { BoundingBox } from "../components/display";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import { TotalTrainData } from "../components/inputFields";
import PageTitle from "../components/PageTitle";
import TestRatioLock from "../components/switches/TestRatioLock";
import TrainRatioLock from "../components/switches/TrainRatioLock";
import ValRatioLock from "../components/switches/ValRatioLock";
import useLockedRatio from "../hooks/useLockedSet";
import useSplitRatio from "../hooks/useSplitRatio";

const clampValue = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max));
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

const adjustRatios = (
  train: number,
  val: number,
  test: number,
  changedKey: "train" | "val" | "test",
  newValue: number,
  trainRatioLocked: boolean,
  valRatioLocked: boolean,
  testRatioLocked: boolean
) => {
  // Calculate the locked value
  const lockedValue = trainRatioLocked
    ? train
    : valRatioLocked
    ? val
    : testRatioLocked
    ? test
    : newValue;

  let remaining = 1 - newValue;

  // The maximum value that can be distributed
  const maxRemaining = 1 - lockedValue;
  // Clamp the new value to prevent excedding the remaining percentage
  const clampedValue = clampValue(newValue, 0, maxRemaining);

  if (changedKey === "train") {
    if (val + test === 0 && !valRatioLocked && !testRatioLocked) {
      train = newValue;
      val = remaining / 2;
      test = remaining / 2;
    } else if (!valRatioLocked && !testRatioLocked) {
      train = newValue;
      val = (val / (val + test)) * remaining;
      test = remaining - val;
    } else if (valRatioLocked) {
      train = clampedValue;
      test = Math.max(remaining - val, 0);
    } else if (testRatioLocked) {
      train = clampedValue;
      val = Math.max(remaining - test, 0);
    }
    return { train, val, test };
  }

  if (changedKey === "val") {
    if (train + test === 0 && !trainRatioLocked && !testRatioLocked) {
      val = newValue;
      train = remaining / 2;
      test = remaining / 2;
    } else if (!trainRatioLocked && !testRatioLocked) {
      val = newValue;
      train = (train / (train + test)) * remaining;
      test = remaining - train;
    } else if (trainRatioLocked) {
      val = clampedValue;
      test = Math.max(remaining - train, 0);
    } else if (testRatioLocked) {
      val = clampedValue;
      train = Math.max(remaining - test, 0);
    }
    return { train, val, test };
  }

  if (changedKey === "test") {
    if (val + train === 0 && !trainRatioLocked && !valRatioLocked) {
      train = remaining / 2;
      val = remaining / 2;
      test = newValue;
    } else if (!trainRatioLocked && !valRatioLocked) {
      train = (train / (train + val)) * remaining;
      val = remaining - train;
      test = newValue;
    } else if (valRatioLocked) {
      test = clampedValue;
      train = Math.max(remaining - val, 0);
    } else if (trainRatioLocked) {
      test = clampedValue;
      val = Math.max(remaining - train, 0);
    }
    return { train, val, test };
  }

  return { train, val, test };
};

const DataSplitterSlider = ({ labelweight = "normal" }: Props) => {
  const { trainRatio, valRatio, testRatio, setRatios } = useSplitRatio();
  const { trainRatioLocked, valRatioLocked, testRatioLocked } =
    useLockedRatio();

  const handleChange = (
    changedKey: "train" | "val" | "test",
    newValue: number
  ) => {
    const { train, val, test } = adjustRatios(
      trainRatio,
      valRatio,
      testRatio,
      changedKey,
      newValue,
      trainRatioLocked,
      valRatioLocked,
      testRatioLocked
    );
    setRatios(train, val, test);
  };
  const mb = "3px";

  return (
    <>
      <PageTitle title="Data Split" />
      <BoundingBox>
        <Text color={"gray.400"} mb={4} fontSize="md">
          Select the split percentage for the training, validation and test
          sets.
        </Text>
        <VStack spacing={{ base: 5, lg: 4 }}>
          {/*Training Slider*/}
          <FormControl>
            <FormLabel fontWeight={labelweight} marginBottom={mb}>
              Training split ({(trainRatio * 100).toFixed(1)}%)
            </FormLabel>
            <HStack>
              <Slider
                value={trainRatio}
                min={0}
                max={1}
                step={0.01}
                onChange={(value) => handleChange("train", value)}
                isDisabled={trainRatioLocked}
              >
                <SliderTrack bg="teal.100">
                  <SliderFilledTrack bg="teal.500" />
                </SliderTrack>
                <SliderThumb boxSize={4} />
              </Slider>
              <TrainRatioLock />
            </HStack>
          </FormControl>

          {/* Validation Split slider */}
          <FormControl>
            <FormLabel fontWeight={labelweight} marginBottom={mb}>
              Validation split ({(valRatio * 100).toFixed(1)}%)
            </FormLabel>
            <HStack>
              <Slider
                value={valRatio}
                min={0}
                max={1}
                step={0.01}
                onChange={(value) => handleChange("val", value)}
                isDisabled={valRatioLocked}
              >
                <SliderTrack bg="orange.200">
                  <SliderFilledTrack bg="orange.500" />
                </SliderTrack>
                <SliderThumb boxSize={4} />
              </Slider>
              <ValRatioLock />
            </HStack>
          </FormControl>

          {/* Testing Split slider */}
          <FormControl>
            <FormLabel fontWeight={labelweight} marginBottom={mb}>
              Testing split ({(testRatio * 100).toFixed(1)}%)
            </FormLabel>
            <HStack>
              <Slider
                value={testRatio}
                min={0}
                max={1}
                step={0.01}
                onChange={(value) => handleChange("test", value)}
                isDisabled={testRatioLocked}
              >
                <SliderTrack bg="green.200">
                  <SliderFilledTrack bg="green.500" />
                </SliderTrack>
                <SliderThumb boxSize={4} />
              </Slider>
              <TestRatioLock />
            </HStack>
          </FormControl>
        </VStack>
      </BoundingBox>

      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={FaLayerGroup}
            title="Augmented Training Set Size"
            description="Specifies the desired number of training images post-augmentation."
          />
          <TotalTrainData />
        </HStack>
      </BoundingBox>

      <BoundingBox transparent padding={0}>
        <HStack>
          <PreviousBtn to="/upload_data/preview" />
          <ContinueBtn to="/settings/select_transformation" />
        </HStack>
      </BoundingBox>
    </>
  );
};

export default DataSplitterSlider;
