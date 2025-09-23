import { useState } from "react";
import api from "../api/axios";

// Base mutation hook
const useMutation = (url, method) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (body = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.request({
        url,
        method,
        data: body, // not used for DELETE normally
      });
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, mutate };
};

export default useMutation;
