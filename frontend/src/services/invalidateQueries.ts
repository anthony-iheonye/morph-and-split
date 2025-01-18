import { QueryClient } from "@tanstack/react-query";

const invalidateQueries = (queryClient: QueryClient, queryKeys: string[]) => {
  for (const name of queryKeys) {
    queryClient.invalidateQueries([name]);
  }
};

export default invalidateQueries;
