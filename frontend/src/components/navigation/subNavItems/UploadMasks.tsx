import { IoImagesOutline } from "react-icons/io5";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
  useImageUploadStatus,
} from "../../../hooks";
import SubNavBarItem from "./SubNavBarItem";

const UploadMasks = () => {
  const { subParentColor } = useActiveNavColor();
  const { uploadMasks } = subParentNames;
  const activeSubParent = useActiveSubParent();
  const { data: imageUploaded } = useImageUploadStatus();

  return (
    <SubNavBarItem
      icon={<IoImagesOutline />}
      iconLabel="Select segmentation masks"
      text={{ md: "Segmentation Masks" }}
      to={"/upload_data/masks"}
      backgroundColor={
        activeSubParent === uploadMasks ? subParentColor : "transparent"
      }
      tooltipLabel="Select segmentation masks"
      disabled={!imageUploaded?.success}
    />
  );
};

export default UploadMasks;
