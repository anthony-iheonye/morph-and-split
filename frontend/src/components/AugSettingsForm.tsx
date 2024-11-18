import { VStack } from "@chakra-ui/react";
import AugmentValSet from "./formInputs/AugmentValSet";
import AugTransformationsInput from "./formInputs/AugTransformationsInput";
import CropConfigInput from "./formInputs/CropConfig";
import DataSplitterSlider from "./formInputs/DataSplitterSlider";
import ImageMaskChannelInput from "./formInputs/ImageMaskChannelInput";
import ResizeAugmentedResult from "./formInputs/ResizeAugmentedResult";
import SaveDirectoryInput from "./formInputs/SaveDirectoryInput";
import TestStartIndexInput from "./formInputs/TestStartIndexInput";
import TotalTrainData from "./formInputs/TotalTrainData";
import TrainStartIndexInput from "./formInputs/TrainStartIndexInput";
import ValStartIndexInput from "./formInputs/ValStartIndexInput";
import VisualAttributeFilePicker from "./formInputs/VisualAttributeFilePicker";

const AugSettingsForm = () => {
  return (
    <VStack>
      <SaveDirectoryInput />
      <TrainStartIndexInput />
      <ValStartIndexInput />
      <TestStartIndexInput />
      <VisualAttributeFilePicker />
      <ImageMaskChannelInput />
      <AugTransformationsInput />
      <CropConfigInput />
      <DataSplitterSlider labelweight="normal" />
      <ResizeAugmentedResult />
      <AugmentValSet />
      <TotalTrainData />
    </VStack>
  );
};

export default AugSettingsForm;
