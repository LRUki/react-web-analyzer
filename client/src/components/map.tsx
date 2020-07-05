import React, { FC, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { Group, useGroupedDataFetch } from "../apis/useGroupedDataFetch";
import { IpInfo } from "../apis/useIpInfoFetch";
import { IpInfoFetchParams } from "../apis/useIpInfoFetch";
import { groupToCircleStyle } from "../styles/mapBoxCircleStyles";
import { FeatureCollection, Point, GeoJsonProperties } from "geojson";
import keys from "../keys";
mapboxgl.accessToken = keys.mapbox;

export type MapBoxState = {
  lng: number;
  lat: number;
  zoom: number;
};

type Stats = {
  totalVisits: number;
  numOfCountries: number;
  numOfRegions: number;
  numOfCities: number;
  lastVisitedTime: string;
};

type MapProps = MapBoxState & {
  groupToSwitchRefs: {
    country: React.MutableRefObject<HTMLElement | null>;
    region: React.MutableRefObject<HTMLElement | null>;
    city: React.MutableRefObject<HTMLElement | null>;
  };
  mostRecentIpRefs: React.MutableRefObject<HTMLElement | null>[];
  mostRecentIpInfo: IpInfo[] | null;
  setMapBoxState: (params: MapBoxState) => void;
  setClickedCircleFetchParam: (params: IpInfoFetchParams | null) => void;
  setStats: (params: Stats | null) => void;
};

const MapRoot: FC<MapProps> = ({
  lng,
  lat,
  zoom,
  groupToSwitchRefs,
  mostRecentIpRefs,
  mostRecentIpInfo,
  setMapBoxState,
  setClickedCircleFetchParam,
  setStats,
}) => {
  let mapContainer = useRef<string | HTMLElement>("");

  const {
    data: country,
    fetched: countryFetched,
    error: countryError,
  } = useGroupedDataFetch("country");
  const {
    data: region,
    fetched: regionFetched,
    error: regionError,
  } = useGroupedDataFetch("region");
  const {
    data: city,
    fetched: cityFetched,
    error: cityError,
  } = useGroupedDataFetch("city");
  const allFetched = countryFetched && regionFetched && cityFetched;

  useEffect(() => {
    if (allFetched && country && region && city && mostRecentIpInfo) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/truffle22/ckbntzq2q0elx1iqwqk9onysn",
        center: [lng, lat],
        zoom: zoom,
      });

      const groups: Group[] = ["country", "region", "city"];

      map.on("load", () => {
        groups.forEach((group) => {
          map.addSource(`${group}Source`, {
            type: "geojson",
            data:
              group === "country"
                ? country
                : group === "region"
                ? region
                : city,
            cluster: true,
            clusterMaxZoom: group === "country" ? 1 : 2,
          });

          map.addLayer({
            id: group,
            type: "circle",
            source: `${group}Source`,
            paint: {
              "circle-color": groupToCircleStyle[group]["circle-color"],
              "circle-radius": groupToCircleStyle[group]["circle-radius"],
              "circle-opacity": 0.7,
            },
          });

          map.addLayer({
            id: `${group}Names`,
            type: "symbol",
            source: `${group}Source`,
            layout: {
              "symbol-sort-key": ["-", 0, ["get", "count"]],
              "text-field": [
                "concat",
                ["get", group],
                ["concat", "\n", ["get", "count"]],
              ],
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
              "text-size": groupToCircleStyle[group]["text-size"],
            },
            paint: {
              "text-color": "white",
            },
          });

          const onSwitchGroupButtonClick = (e: any) => {
            hideAllLayOuts(groups);
            map.setLayoutProperty(`${group}`, "visibility", "visible");
            map.setLayoutProperty(`${group}Names`, "visibility", "visible");
          };
          groupToSwitchRefs[group]?.current?.addEventListener(
            "click",
            onSwitchGroupButtonClick
          );

          map.on("click", `${group}`, (e) => {
            if (e.features && e.features[0].properties) {
              const { country, region, city } = e.features[0].properties;
              setClickedCircleFetchParam({ country, region, city });
            }
          });
        });
      });
      map.on("style.load", () => {
        setTimeout(() => {
          groupToSwitchRefs["region"]?.current?.click();
        }, 2500);
      });
      //associating mostRedcentIpInfo with its location for teh zoom feature

      for (
        let i = 0;
        i < Math.min(mostRecentIpRefs.length, mostRecentIpInfo.length);
        i++
      ) {
        if (
          mostRecentIpInfo[i] &&
          mostRecentIpInfo[i].loc &&
          mostRecentIpRefs[i]
        ) {
          let lat = parseFloat(mostRecentIpInfo[i].loc.split(",")[0]);
          let lng = parseFloat(mostRecentIpInfo[i].loc.split(",")[1]);
          mostRecentIpRefs[i].current?.addEventListener("click", () => {
            map.flyTo({
              center: [lng, lat],
              zoom: 9,
              essential: true,
            });
          });
        }
      }

      map.on("click", (e) => {
        setMapBoxState({
          lng: e.lngLat.lng,
          lat: e.lngLat.lat,
          zoom: parseInt(map.getZoom().toFixed(2)),
        });
      });

      //helper functions
      const hideAllLayOuts = (groups: Group[]) => {
        groups.forEach((group) => {
          map.setLayoutProperty(group, "visibility", "none");
          map.setLayoutProperty(`${group}Names`, "visibility", "none");
        });
      };
      const countTotalVisits = (
        country: FeatureCollection<Point, GeoJsonProperties>
      ) => {
        let totalVisits = 0;
        country?.features.forEach((e) => {
          totalVisits += e.properties?.count;
        });
        return totalVisits;
      };
      //set state for the stats
      setStats({
        totalVisits: countTotalVisits(country),
        numOfCountries: country.features.length,
        numOfRegions: region.features.length,
        numOfCities: city.features.length,
        lastVisitedTime:
          mostRecentIpInfo[0].visits[mostRecentIpInfo[0].visits.length - 1]
            .time,
      });
    }
  }, [allFetched]);
  if (countryError || regionError || cityError) {
    return (
      <h1 style={{ color: "red" }}>
        could not fetch visitors data from the database...
        <br /> please try agian later{" "}
      </h1>
    );
  }
  return (
    <>
      <div
        className="mapContainer"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          height: "100%",
          width: "100%",
        }}
        ref={(el: HTMLDivElement) => {
          mapContainer.current = el;
        }}
      />
    </>
  );
};

export const Map = React.memo(MapRoot, () => true);
