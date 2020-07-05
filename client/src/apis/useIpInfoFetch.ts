import { useCallback } from "react";
import { getRequest } from "./request";
import { useFetch, FetchOption } from "../hooks/useFetch";
type Visit = {
  time: string;
};
export type IpInfo = {
  _id: string;
  country: string;
  region: string;
  city: string;
  loc: string;
  visits: Visit[];
  firstVisitTime?: string;
  hostname?: string;
  org?: string;
  timezone?: string;
  count?: number;
};
export type IpInfoFetchParams = {
  country?: string;
  region?: string;
  city?: string;
  sort?: boolean;
  size?: number;
} | null;
export const useIpInfoFetch = (
  params: IpInfoFetchParams,
  options?: FetchOption<IpInfo[]>
) => {
  const fetchedIpInfo = useCallback(async () => {
    const { data } = await getRequest<IpInfo[]>({
      url: "/ip/",
      // url: "http://localhost:5001/ip/",
      params,
    });
    return data;
  }, [
    params?.country,
    params?.city,
    params?.region,
    params?.sort,
    params?.size,
  ]);
  return useFetch<IpInfo[]>(fetchedIpInfo, options);
};
