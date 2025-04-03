import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { MdInfoOutline } from "react-icons/md";

/**
 * StratifiedFileHint renders an icon button that opens a popover with CSV format requirements.
 *
 * It is used to guide users when uploading a CSV file for stratified splitting.
 * The popover lists rules and also provides a downloadable sample CSV.
 */
const StratifiedFileHint = () => {
  return (
    <Popover placement="auto">
      <PopoverTrigger>
        <IconButton
          aria-label="CSV format hint"
          icon={<MdInfoOutline />}
          variant="ghost"
          size="sm"
          _hover={{ bg: "transparent" }}
        />
      </PopoverTrigger>
      <PopoverContent boxShadow="lg" p={4} maxHeight="47vh">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader> CSV Requirements</PopoverHeader>
        <PopoverBody overflowY="auto">
          <ul className="csv-requirements-list">
            <li>The first row must contain column headers.</li>
            <li>
              The file must have a column named <b>'image_id'</b>.
            </li>
            <li>
              Each value in <b>'image_id'</b> must exactly match its
              corresponding image filename.
            </li>
            <li>
              Column names cannot contain spaces and must be between 1 and 25
              characters long.
            </li>
            <li>
              Values in the <b>'image_id'</b> column cannot contain spaces.
            </li>
            <li>
              The number of rows must match the number of images in the dataset.
            </li>
          </ul>
          <a
            href="/assets/sample_split_data.csv"
            download="sample_split_data.csv"
            style={{
              display: "inline-block",
              marginTop: "1rem",
              color: "#3182ce",
            }}
          >
            Download sample CSV
          </a>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default StratifiedFileHint;
