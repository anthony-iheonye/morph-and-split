import { useQueryClient } from "@tanstack/react-query";

const invalidateQueries = (queryNames: string[]) => {
  const queryClient = useQueryClient();
  for (const name of queryNames) {
    queryClient.invalidateQueries([name]);
  }
};

export default invalidateQueries;
