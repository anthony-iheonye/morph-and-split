import { FaDownload } from "react-icons/fa6";
import IconButtonWithToolTip from "./IconButtonWithToolTip";
import { useBackendResponse } from "../../hooks";
import { Spinner } from "@chakra-ui/react";

interface DownloadFileProps {
  onDownload: () => void;
}

const DownloadButton = ({ onDownload }: DownloadFileProps) => {
  const { isDownloading } = useBackendResponse();

  return (
    <IconButtonWithToolTip
      aria-label="Click to download augmented result."
      type="button"
      tooltipLabel="Download augmented result"
      color="teal.500"
      backgroundColor="transparent"
      onClick={onDownload}
      icon={!isDownloading ? <FaDownload /> : <Spinner />}
      iconHoverColor="teal.200"
    />
  );
};

export default DownloadButton;
