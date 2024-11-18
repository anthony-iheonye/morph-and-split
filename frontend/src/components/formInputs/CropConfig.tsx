import useAugConfigAndSetter from "../../hooks/useAugConfigAndSetter";
import CropInput from "./CropInput";
import HeightOffsetInput from "./HeightOffsetInput";
import TargetHeightInput from "./TargetHeight";
import TargetWidthInput from "./TargetWidthInput";
import WidthOffsetInput from "./WidthOffsetInput";

const CropConfigInput = () => {
  const { augConfig } = useAugConfigAndSetter();

  return (
    <>
      <CropInput />
      {augConfig.crop ? (
        <>
          <HeightOffsetInput />
          <WidthOffsetInput />
          <TargetHeightInput />
          <TargetWidthInput />
        </>
      ) : null}
    </>
  );
};

export default CropConfigInput;
