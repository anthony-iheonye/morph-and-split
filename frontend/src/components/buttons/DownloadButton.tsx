import { IconButton, Tooltip } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa6";

interface DownloadFileProps {
  filename: string;
  onDownload: (filename: string) => void;
}

const DownloadButton = ({ filename, onDownload }: DownloadFileProps) => {
  return (
    <Tooltip label="Download augmented data">
      <IconButton
        aria-label="Click to download augmented result."
        type="button"
        color="teal"
        backgroundColor="transparent"
        onClick={() => onDownload(filename)}
        icon={<FaDownload />}
        borderRadius={20}
        size={"lg"}
      />
    </Tooltip>
  );
};

export default DownloadButton;
