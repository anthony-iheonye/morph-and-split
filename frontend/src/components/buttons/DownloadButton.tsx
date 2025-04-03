import { FaDownload } from "react-icons/fa6";
import IconButtonWithToolTip from "./IconButtonWithToolTip";
import { useBackendResponse } from "../../hooks";
import { Spinner } from "@chakra-ui/react";

/**
 * Props for the DownloadButton component.
 *
 * @property {() => void} onDownload - Callback function to trigger when download is initiated.
 */
interface DownloadFileProps {
  onDownload: () => void;
}

/**
 * DownloadButton component renders a stylized icon button to initiate downloading of augmented results.
 * Displays a spinner while download is in progress, as indicated by backend state.
 *
 * @param {DownloadFileProps} props - Component props.
 * @returns {JSX.Element} An icon button that calls the onDownload function and shows loading feedback.
 */
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
