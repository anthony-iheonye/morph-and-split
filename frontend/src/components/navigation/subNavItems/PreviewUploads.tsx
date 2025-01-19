import { MdGridView } from "react-icons/md";
import { SubNavBarItem } from ".";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
} from "../../../hooks";

const PreviewUploads = () => {
  const { subParentColor } = useActiveNavColor();
  const { previewUpload } = subParentNames;
  const activeSubParent = useActiveSubParent();

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
    />
  );
};

export default PreviewUploads;
