import React, { FC } from "react";
import { Flexbox, View } from "./view";
type Props = { lat: number; lng: number };
export const LocationContainer: FC<Props> = ({ lat, lng }) => {
  return (
    <Flexbox
      p="10px"
      justifyContent="flex-start"
      color="white"
      fontSize={
        window.window.outerWidth < 730 || window.window.outerHeight < 550
          ? "3vw"
          : "1.7vw"
      }
    >
      <View m="10px">lat : {lat}</View>
      <View m="10px">lng : {lng}</View>
    </Flexbox>
  );
};
