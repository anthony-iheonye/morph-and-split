import { useQuery } from "@tanstack/react-query";
import { BackendResponse } from "../entities";
import { APIClient } from "../services";
import ms from "ms";

const statusClient = new APIClient<BackendResponse>(
  "/status_checks/image_mask_balance_status"
);

const useImageMaskBalanceStatus = () => {
  return useQuery<BackendResponse, Error>({
    queryKey: ["imageMaskBalanceStatus"],
    queryFn: statusClient.getStatus,
    staleTime: ms("24h"),
  });
};

export default useImageMaskBalanceStatus;
