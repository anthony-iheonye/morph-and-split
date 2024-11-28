import { Button } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa6";

interface DownloadFileProps {
  filename: string;
  label: string;
  onDownload: (filename: string) => void;
}

const DownloadButton = ({
  filename,
  onDownload,
  label = "Download File",
}: DownloadFileProps) => {
  return (
    <Button
      type="button"
      colorScheme="teal"
      leftIcon={<FaDownload />}
      onClick={() => onDownload(filename)}
    >
      {label}
    </Button>
  );
};

export default DownloadButton;
