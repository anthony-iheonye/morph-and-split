import { VStack } from "@chakra-ui/react";
import CropConfigInput from "./formInputs/CropConfig";
import ResizeAugmentedResult from "./formInputs/ResizeAugmentedResult";
import SaveDirectoryInput from "./formInputs/SaveDirectoryInput";
import TestStartIndexInput from "./formInputs/TestStartIndexInput";
import TrainStartIndexInput from "./formInputs/TrainStartIndexInput";
import ValStartIndexInput from "./formInputs/ValStartIndexInput";
import VisualAttributeFilePicker from "./formInputs/VisualAttributeFilePicker";

const AugSettingsForm = () => {
  return (
    <VStack padding={0}>
      {/* <ImageSelector /> */}
      {/* <MaskSelector /> */}
      <SaveDirectoryInput />
      <TrainStartIndexInput />
      <ValStartIndexInput />
      <TestStartIndexInput />
      {/* <VisualAttributeFilePicker /> */}
      {/* <ImageMaskChannelInput /> */}
      {/* <AugTransformationsInput /> */}
      <CropConfigInput />
      {/* <DataSplitterSlider labelweight="normal" /> */}
      <ResizeAugmentedResult />
      {/* <AugmentValSet /> */}
      {/* <TotalTrainData /> */}
    </VStack>
  );
};

export default AugSettingsForm;
