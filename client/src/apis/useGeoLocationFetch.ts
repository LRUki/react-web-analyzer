import { useCallback } from "react";
import { getRequest } from "./request";
import { useFetch } from "../hooks/useFetch";
type IpResponse = { ip: string };
type GeoLocationResponse = {
  latitude: number;
  longitude: number;
  success: boolean;
  error?: any;
};
export const useGeoLocationFetch = () => {
  const fetchGeoLocation = useCallback(async () => {
    const { data: geoData } = await getRequest<GeoLocationResponse>({
      url: "/geolocation",
    });
    return geoData;
  }, []);

  return useFetch<GeoLocationResponse>(fetchGeoLocation);
};
