import React, { FC } from "react";
import { View, Flexbox } from "./view";
import { Icon, Statistic } from "semantic-ui-react";
export type StatsProps = {
  totalVisits: number;
  numOfCountries: number;
  numOfRegions: number;
  numOfCities: number;
  lastVisitedTime: string;
};
export const Stats: FC<StatsProps> = React.memo(
  ({
    totalVisits,
    numOfCountries,
    numOfRegions,
    numOfCities,
    lastVisitedTime,
  }) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      <>
        <View
          fontSize={window.window.outerWidth < 730 ? "3vw" : "1.8vw"}
          lineHeight="1.1"
          m="4px"
        >
          This web-app visualizes{" "}
          <a href="http://www.leo-ryuta.work" style={{ color: "green" }}>
            my website's
          </a>{" "}
          traffic. <Icon name="react" color="blue" /> Click the circle for more
          details!
        </View>
        <View fontSize={window.window.outerWidth < 730 ? "2vw" : "1vw"}>
          <Statistic.Group
            inverted
            size={window.window.outerWidth < 730 ? "mini" : "small"}
            widths="three"
          >
            <Flexbox width="100%" mt="20px">
              <Statistic color="teal" inverted>
                <Statistic.Value>
                  {totalVisits} <Icon name="chart line" />
                </Statistic.Value>
                <Statistic.Label>totalVisits</Statistic.Label>
              </Statistic>
              <Statistic color="purple" inverted>
                <Statistic.Value>
                  <View>
                    {
                      monthNames[
                        parseInt(lastVisitedTime.split("(")[0].split("/")[1]) -
                          1
                      ]
                    }{" "}
                    {lastVisitedTime.split("(")[0].split("/")[2]},
                    {lastVisitedTime.split(")")[1]}
                  </View>
                </Statistic.Value>
                <Statistic.Label>
                  last visit time (GMT)
                  <Icon name="globe" color="purple" />
                </Statistic.Label>
              </Statistic>
            </Flexbox>
            <Statistic color="red" inverted>
              <Statistic.Value>{numOfCountries}</Statistic.Value>
              <Statistic.Label>Countries</Statistic.Label>
            </Statistic>

            <Statistic color="orange" inverted>
              <Statistic.Value>{numOfRegions}</Statistic.Value>
              <Statistic.Label>Regions</Statistic.Label>
            </Statistic>

            <Statistic color="pink" inverted>
              <Statistic.Value>{numOfCities}</Statistic.Value>
              <Statistic.Label>Cities</Statistic.Label>
            </Statistic>
          </Statistic.Group>
        </View>
      </>
    );
  }
);
