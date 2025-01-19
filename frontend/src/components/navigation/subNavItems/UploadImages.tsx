import { IoImages } from "react-icons/io5";
import { SubNavBarItem } from ".";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
} from "../../../hooks";

const UploadImages = () => {
  const { subParentColor } = useActiveNavColor();
  const { uploadImages } = subParentNames;
  const activeSubParent = useActiveSubParent();

  return (
    <SubNavBarItem
      icon={<IoImages />}
      iconLabel="Upload Images"
      text={{ md: "Images" }}
      to="/upload_data/images"
      backgroundColor={
        activeSubParent === uploadImages ? subParentColor : "transparent"
      }
      tooltipLabel="Select Images"
    />
  );
};

export default UploadImages;
