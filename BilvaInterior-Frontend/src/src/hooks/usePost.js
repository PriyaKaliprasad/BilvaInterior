import useMutation from "./useMutation";

export const usePost = (url) => useMutation(url, "POST");
