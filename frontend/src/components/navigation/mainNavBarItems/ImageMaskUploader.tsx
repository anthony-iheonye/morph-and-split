import { FaFileUpload } from "react-icons/fa";
import useActiveNavColor from "../../../hooks/useActiveNavColor";
import useActiveParent, { parentNames } from "../../../hooks/useActiveParent";
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
