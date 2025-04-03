import { QueryClient } from "@tanstack/react-query";

/**
 * Invalidates multiple React Query cache entries based on their keys.
 * This triggers a refetch of any active queries matching the provided keys.
 *
 * @param queryClient - React Query client instance.
 * @param queryKeys - Array of query keys to invalidate.
 */
const invalidateQueries = (queryClient: QueryClient, queryKeys: string[]) => {
  for (const name of queryKeys) {
    queryClient.invalidateQueries([name]);
  }
};

export default invalidateQueries;
