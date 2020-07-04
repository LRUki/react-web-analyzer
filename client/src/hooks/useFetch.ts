import { useEffect, useState, useCallback } from "react";
export type FetchOption<Data> = {
  onComplete?: (params: Data) => void;
  onFailure?: (params: any) => void;
  notImmediate?: boolean;
};
export const useFetch = <Data>(
  request: () => Promise<Data>,
  options?: FetchOption<Data>
) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<any | null>(null);
  const onComplete = options?.onComplete;
  const onFailure = options?.onFailure;

  const doFetch = useCallback(async () => {
    setError(null);
    setData(null);
    setFetching(true);
    try {
      const data = await request();
      setData(data);
      setFetched(true);
      setFetching(false);
      if (onComplete) onComplete(data);
    } catch (error) {
      setError(error);
      setFetching(false);
      if (onFailure) onFailure(error);
    }
  }, [onComplete, onFailure, request]);

  useEffect(() => {
    if (options && options.notImmediate) return;
    doFetch();
  }, [doFetch, options]);

  return { fetching, fetched, doFetch, data, error };
};
