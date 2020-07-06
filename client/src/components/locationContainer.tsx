import React, { FC } from "react";
import { Flexbox, View } from "./view";
import { minWidthHeight } from "../styles/minWidthHeight";
type Props = { lat: number; lng: number };
export const LocationContainer: FC<Props> = ({ lat, lng }) => {
  return (
    <Flexbox
      p="10px"
      justifyContent="flex-start"
      color="white"
      fontSize={
        window.window.outerWidth < minWidthHeight.width ||
        window.window.outerHeight < minWidthHeight.height
          ? "3vw"
          : "1.7vw"
      }
    >
      <View m="10px">lat : {lat}</View>
      <View m="10px">lng : {lng}</View>
    </Flexbox>
  );
};
