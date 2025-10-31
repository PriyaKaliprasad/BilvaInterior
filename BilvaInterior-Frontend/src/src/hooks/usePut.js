import useMutation from "./useMutation";

export const usePut = (url) => useMutation(url, "PUT");
