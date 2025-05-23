import { Spinner, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { MdDeleteForever } from "react-icons/md";
import { useBackendResponse } from "../../hooks";
import { handleDeleteMasks } from "../../services";
import IconButtonWithToolTip from "./IconButtonWithToolTip";

/**
 * DeleteMasks component renders a button for deleting uploaded masks.
 *
 * @returns {JSX.Element} An IconButton component configured with mask deletion functionality and tooltip.
 */
const DeleteMasks = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { setBackendResponseLog, maskIsUploading, deletingMasks } =
    useBackendResponse();

  return (
    <IconButtonWithToolTip
      aria-label="Click to delete uploaded masks"
      tooltipLabel="Delete all masks"
      icon={deletingMasks ? <Spinner /> : <MdDeleteForever />}
      onClick={() =>
        handleDeleteMasks({
          queryClient,
          setBackendResponseLog,
          toast,
        })
      }
      placement="left-start"
      isDisabled={maskIsUploading}
    />
  );
};

export default DeleteMasks;
