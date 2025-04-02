import { MdGridView } from "react-icons/md";
import { SubNavBarItem } from ".";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
  useImageMaskBalanceStatus,
  useImageUploadStatus,
} from "../../../hooks";

const PreviewUploads = () => {
  const { subParentColor } = useActiveNavColor();
  const { previewUpload } = subParentNames;
  const activeSubParent = useActiveSubParent();
  const { data: imageUploaded } = useImageUploadStatus();
  const { data: imageMaskBalance } = useImageMaskBalanceStatus();

  return (
    <SubNavBarItem
      icon={<MdGridView />}
      iconLabel="Preview uploaded images and masks"
      text={{ md: "Preview" }}
      to={"/upload_data/preview"}
      backgroundColor={
        activeSubParent === previewUpload ? subParentColor : "transparent"
      }
      tooltipLabel="Preview uploaded images and masks"
      disabled={!imageUploaded?.success || !imageMaskBalance?.success}
    />
  );
};

export default PreviewUploads;
