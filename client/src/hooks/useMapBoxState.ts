import { useState, useEffect } from "react";
import { useGeoLocationFetch } from "../apis/useGeoLocationFetch";
import { MapBoxState } from "../components/map";

export const defaultMapState: MapBoxState = {
  lat: 51.543,
  lng: -0.1478,
  zoom: 5,
};
//location on the map. the inital location will be set to the user's geolocation
//otherwise london
export const useMapBoxState = (): [
  boolean,
  MapBoxState | null,
  (parmas: MapBoxState) => void
] => {
  const [mapBoxState, setMapBoxState] = useState<MapBoxState | null>(null);

  const { data, fetching, fetched, error } = useGeoLocationFetch();

  useEffect(() => {
    if (fetching) return;
    if (fetched && data) {
      const { latitude, longitude, success } = data;
      setMapBoxState(
        success ? { lat: latitude, lng: longitude, zoom: 5 } : defaultMapState
      );
    }
  }, [data, fetched, error, fetching]);
  return error
    ? [fetched, defaultMapState, setMapBoxState]
    : [fetched, mapBoxState, setMapBoxState];
};
