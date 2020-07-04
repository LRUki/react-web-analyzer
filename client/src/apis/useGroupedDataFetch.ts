import { useCallback } from "react";
import { getRequest } from "./request";
import { useFetch, FetchOption } from "../hooks/useFetch";
import { FeatureCollection, Point, GeoJsonProperties } from "geojson";

export type GroupedDataResponse = FeatureCollection<Point, GeoJsonProperties>;
export type Group = "country" | "region" | "city";
export const useGroupedDataFetch = (
  group: Group,
  option?: FetchOption<FeatureCollection<Point, GeoJsonProperties>>
) => {
  const fetchGroupedData = useCallback(async () => {
    const { data } = await getRequest<
      FeatureCollection<Point, GeoJsonProperties>
    >({
      url: `/ip/${group}`,
      // url: `http://localhost:5001/ip/${group}`,
    });
    return data;
  }, [group]);
  return useFetch<FeatureCollection<Point, GeoJsonProperties>>(
    fetchGroupedData,
    option
  );
};
