import useMutation from "./useMutation";

export const usePatch = (url) => useMutation(url, "PATCH");
