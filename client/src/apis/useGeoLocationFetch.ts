import { useCallback } from "react";
import { getRequest } from "./request";
import { useFetch } from "../hooks/useFetch";
import keys from "../keys";
type IpResponse = { ip: string };
type GeoLocationResponse = {
  latitude: number;
  longitude: number;
  success?: boolean;
};
export const useGeoLocationFetch = () => {
  const fetchGeoLocation = useCallback(async () => {
    const { data: ipData } = await getRequest<IpResponse>({
      url: "https://api.ipify.org/",
      params: {
        format: "json",
      },
    });
    const { data: geoData } = await getRequest<GeoLocationResponse>({
      url: `http://api.ipstack.com/${ipData.ip}`,
      params: { access_key: keys.ipstack },
    });
    return geoData;
  }, []);

  return useFetch<GeoLocationResponse>(fetchGeoLocation);
};
