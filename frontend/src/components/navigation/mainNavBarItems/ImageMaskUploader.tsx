import { FaFileUpload } from "react-icons/fa";
import {
  parentNames,
  useActiveNavColor,
  useActiveParent,
} from "../../../hooks";
import MainNavBarItem from "./MainNavBarItem";

const ImageMaskUploader = () => {
  const activeParent = useActiveParent();
  const { uploadImageAndMask } = parentNames;
  const { parentColor } = useActiveNavColor();

  return (
    <MainNavBarItem
      icon={<FaFileUpload />}
      iconLabel="Upload Image and segmentation mask"
      to="/upload_data"
      backgroundColor={
        activeParent === uploadImageAndMask ? parentColor : "transparent"
      }
      tooltipLabel="Upload data"
    />
  );
};

export default ImageMaskUploader;
