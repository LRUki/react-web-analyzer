import React, { FC } from "react";
import { View, Flexbox, ViewProps } from "./view";
import { IpInfo } from "../apis/useIpInfoFetch";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
type IpInfoContainerProps = ViewProps & {
  ipData: IpInfo[];
  mostRecentIpRefs?: React.MutableRefObject<HTMLElement | null>[];
};
export const IpInfoContainer: FC<IpInfoContainerProps> = ({
  ipData,
  mostRecentIpRefs,
  ...props
}) => {
  return (
    <Flexbox
      {...props}
      flexDirection="column"
      px="10px"
      color="white"
      width="100%"
      overflowY="scroll"
      backgroundColor="rgba(0, 0, 0, 0.6)"
    >
      {ipData.map((e, i) => {
        return (
          <View key={i}>
            {i !== 0 && <Line />}
            <IpInfoItem ipinfo={e}>
              {mostRecentIpRefs && (
                <div
                  ref={(el) => {
                    mostRecentIpRefs[i].current = el;
                  }}
                >
                  <Button animated="fade" color="grey" inverted>
                    <Button.Content hidden>{ipData[i].region}</Button.Content>
                    <Button.Content visible>zoom</Button.Content>
                  </Button>
                </div>
              )}
            </IpInfoItem>
          </View>
        );
      })}
    </Flexbox>
  );
};

const IpInfoItem: FC<{ ipinfo: IpInfo }> = ({ ipinfo, children }) => {
  const {
    _id: ip,
    country,
    region,
    city,
    visits,
    hostname,
    count,
    loc,
    org,
    timezone,
  } = ipinfo;
  const lastVisitTime = visits[visits.length - 1].time;
  const month = lastVisitTime.split("/")[1];
  const date = lastVisitTime.split("/")[2].split("(")[0];
  const time = lastVisitTime.split("/")[2].split(")")[1];
  const imageUrl = `https://www.countryflags.io/${country}/shiny/64.png`;
  return (
    <Flexbox justifyContent="space-between" py="2px" marginBottom="20px">
      <Flexbox flexDirection="column" my="2px">
        <Flexbox
          fontSize="15px"
          color="pink"
          justifyContent="flex-start"
          px="10px"
        >
          <img src={imageUrl} alt={country}></img>
          <Elem>
            <View position="relative" top="32px" left="5px">
              {country}
            </View>
          </Elem>
        </Flexbox>

        <Flexbox color="grey" fontSize="12px" justifyContent="flext-between">
          <View px="10px">
            <Elem>
              IPv4: <View>{ip}</View>
            </Elem>
            <Elem>
              Region: <View>{region}</View>
            </Elem>
            <Elem>
              City: <View>{city}</View>{" "}
            </Elem>
          </View>

          <View px="10px">
            <Elem>
              Total visits: <View>{count}</View>{" "}
            </Elem>
            <Elem>
              Location: <View>{loc}</View>
            </Elem>
            <Elem>
              Last visit:
              <View>{month + "/" + date + "," + time} (GMT)</View>
            </Elem>
          </View>
          {!children && (
            <View px="10px">
              {timezone && (
                <Elem>
                  Time zone: <View>{timezone}</View>
                </Elem>
              )}
              {org && (
                <Elem>
                  Organization: <View>{org}</View>{" "}
                </Elem>
              )}
              {hostname && (
                <Elem>
                  Hostname: <View>{hostname}</View>{" "}
                </Elem>
              )}
            </View>
          )}
        </Flexbox>
      </Flexbox>
      {children && <Flexbox alignItems="flex-end">{children}</Flexbox>}
    </Flexbox>
  );
};

const Line = () => {
  return (
    <hr
      style={{
        border: "none",
        height: "2.5px",
        backgroundColor: "white",
        width: "110%",
        top: "27%",
      }}
    ></hr>
  );
};

const Elem = styled(Flexbox)`
  color: white;
  div {
    color: #c3dfe8;
    margin-left: 4px;
  }
`;
