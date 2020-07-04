import React, { FC, useRef, useState, useEffect } from "react";
import { View, Flexbox } from "./components/view";
import { Loading } from "./components/loading";
import { Map } from "./components/map";
import { useMapBoxState } from "./hooks/useMapBoxState";
import { useIpInfoFetch, IpInfoFetchParams } from "./apis/useIpInfoFetch";
import { Button, Segment } from "semantic-ui-react";
import { StatsProps, Stats } from "./components/stats";
import { IpInfoContainer } from "./components/ipinfoContainer";
import { LocationContainer } from "./components/locationContainer";

const RECENT_VISITS_FETCH_SIZE = 5;
const CLICKED_CIRCLE_FETCH_SIZE = 10;
export type DisplayMode = "MostRecentVisits" | "ClickedCircle";
export const Dashboard: FC<{}> = () => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    "MostRecentVisits"
  );

  const [clickedCircleFetchParam, setClickedCircleFetchParam] = useState<
    IpInfoFetchParams
  >(null);

  const [stats, setStats] = useState<StatsProps | null>(null);
  const {
    fetched: fetchedMostRecntIpInfo,
    data: mostRecentIpInfo,
  } = useIpInfoFetch({
    sort: true,
    size: RECENT_VISITS_FETCH_SIZE,
  });
  const { fetched: fetchedCircleIpInfo, data: circleIpInfo } = useIpInfoFetch({
    ...clickedCircleFetchParam,
    sort: true,
    size: CLICKED_CIRCLE_FETCH_SIZE,
  });

  const [fetchedMapBoxState, mapBoxState, setMapBoxState] = useMapBoxState();
  const switchToCountryRef = useRef<HTMLElement | null>(null);
  const switchToRegionRef = useRef<HTMLElement | null>(null);
  const switchToCityRef = useRef<HTMLElement | null>(null);
  const groupToSwitchRefs = {
    country: switchToCountryRef,
    region: switchToRegionRef,
    city: switchToCityRef,
  };
  const recentRef1 = useRef<HTMLElement | null>(null);
  const recentRef2 = useRef<HTMLElement | null>(null);
  const recentRef3 = useRef<HTMLElement | null>(null);
  const recentRef4 = useRef<HTMLElement | null>(null);
  const recentRef5 = useRef<HTMLElement | null>(null);
  const mostRecentIpRefs = [
    recentRef1,
    recentRef2,
    recentRef3,
    recentRef4,
    recentRef5,
  ];
  useEffect(() => {
    setDisplayMode(
      clickedCircleFetchParam && Object.keys(clickedCircleFetchParam).length > 0
        ? "ClickedCircle"
        : "MostRecentVisits"
    );
  }, [clickedCircleFetchParam]);

  if (!fetchedMostRecntIpInfo || !fetchedMapBoxState || !fetchedCircleIpInfo) {
    return (
      <Loading size="huge" active>
        Loading the map...
      </Loading>
    );
  }

  return (
    <View>
      <View aboveMap>
        {mapBoxState && (
          <LocationContainer lat={mapBoxState.lat} lng={mapBoxState.lng} />
        )}
      </View>

      <View
        aboveMap
        top="6vh"
        left={window.window.outerWidth < 730 ? "47vw" : "56vw"}
        width={window.window.outerWidth < 730 ? "50vw" : "40vw"}
      >
        <Segment inverted>
          <View>
            {stats && <Stats {...stats} />}
            <View fontWeight="1000" fontSize="1.7vw" my="10px" color="#cbccc0">
              {displayMode === "MostRecentVisits" && clickedCircleFetchParam ? (
                "Recent Visits"
              ) : (
                <>
                  {clickedCircleFetchParam?.country && (
                    <View>Country : {clickedCircleFetchParam.country}</View>
                  )}
                  {clickedCircleFetchParam?.region && (
                    <View>Region : {clickedCircleFetchParam.region}</View>
                  )}
                  {clickedCircleFetchParam?.city && (
                    <View>City : {clickedCircleFetchParam.city}</View>
                  )}
                </>
              )}
            </View>
            {mostRecentIpInfo && (
              <IpInfoContainer
                height={displayMode === "MostRecentVisits" ? "37vh" : "0vh"}
                ipData={mostRecentIpInfo}
                mostRecentIpRefs={mostRecentIpRefs}
              />
            )}
            {displayMode === "ClickedCircle" && circleIpInfo && (
              <>
                <IpInfoContainer ipData={circleIpInfo} height="37vh" />
                <Flexbox justifyContent="flex-end" pt="10px">
                  <Button
                    color="grey"
                    width="21px"
                    onClick={() => {
                      setDisplayMode("MostRecentVisits");
                    }}
                  >
                    Go back
                  </Button>
                </Flexbox>
              </>
            )}
          </View>
        </Segment>
      </View>

      <Flexbox
        p="10px"
        justifyContent="center"
        position="relative"
        top="90vh"
        marginBottom="3vh"
        aboveMap
      >
        <SwitchGroupButton switchRef={switchToCountryRef}>
          Country
        </SwitchGroupButton>
        <SwitchGroupButton switchRef={switchToRegionRef}>
          Region
        </SwitchGroupButton>
        <SwitchGroupButton switchRef={switchToCityRef}>City</SwitchGroupButton>
      </Flexbox>
      {mapBoxState && (
        <Map
          {...mapBoxState}
          setMapBoxState={setMapBoxState}
          groupToSwitchRefs={groupToSwitchRefs}
          mostRecentIpRefs={mostRecentIpRefs}
          mostRecentIpInfo={mostRecentIpInfo}
          setClickedCircleFetchParam={setClickedCircleFetchParam}
          setStats={setStats}
        />
      )}
    </View>
  );
};

const SwitchGroupButton: FC<{
  switchRef: React.MutableRefObject<HTMLElement | null>;
}> = ({ switchRef, children }) => {
  return (
    <View m="6px">
      <div
        ref={(el) => {
          switchRef.current = el;
        }}
      >
        <Button inverted color="olive">
          <View width="64px">{children}</View>
        </Button>
      </div>
    </View>
  );
};
