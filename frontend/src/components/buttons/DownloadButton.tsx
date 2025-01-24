import { FaDownload } from "react-icons/fa6";
import IconButtonWithToolTip from "./IconButtonWithToolTip";

interface DownloadFileProps {
  filename: string;
  onDownload: (filename: string) => void;
}

const DownloadButton = ({ filename, onDownload }: DownloadFileProps) => {
  return (
    <IconButtonWithToolTip
      aria-label="Click to download augmented result."
      type="button"
      tooltipLabel="Download augmented result"
      color="teal.500"
      backgroundColor="transparent"
      onClick={() => onDownload(filename)}
      icon={<FaDownload />}
      iconHoverColor="teal.200"
    />
  );
};

export default DownloadButton;
