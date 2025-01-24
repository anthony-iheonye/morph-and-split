import { Spinner, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { MdDeleteForever } from "react-icons/md";
import { useBackendResponse } from "../../hooks";
import { handleDeleteMasks } from "../../services";
import IconButtonWithToolTip from "./IconButtonWithToolTip";

/**
 * Delete uploaded images.
 * @returns
 */
const DeleteMasks = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { setBackendResponseLog, maskIsUploading, deletingMasks } =
    useBackendResponse();

  return (
    <IconButtonWithToolTip
      aria-label="Click to delete uploaded images"
      tooltipLabel="Delete all images"
      icon={deletingMasks ? <Spinner /> : <MdDeleteForever />}
      onClick={() =>
        handleDeleteMasks({
          queryClient,
          setBackendResponseLog,
          toast,
        })
      }
      isDisabled={maskIsUploading}
    />
  );
};

export default DeleteMasks;
