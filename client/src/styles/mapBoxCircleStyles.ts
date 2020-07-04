import mapboxgl from "mapbox-gl";
export const groupToCircleStyle: CircleStyleType = {
  country: {
    "circle-color": [
      "step",
      ["get", "count"],
      "#c973ff",
      10,
      "#ffe11f",
      20,
      "#6edbd9",
      50,
      "#64ed32",
      100,
      "#f7f00f",
      200,
      "#ff5f03",
    ],
    "circle-radius": [
      "step",
      ["get", "count"],
      12,

      10,

      25,

      20,

      40,

      50,

      70,

      100,

      75,

      200,

      100,
    ],
    "text-size": [
      "step",
      ["get", "count"],
      12,
      10,
      14,
      20,
      20,
      50,
      25,
      100,
      29,
      200,
      32,
    ],
  },

  region: {
    "circle-color": [
      "step",
      ["get", "count"],
      "#c973ff",
      5,
      "#ffe11f",
      10,
      "#6edbd9",
      30,
      "#e1ac55",
      50,
      "#f7f00f",
      100,
      "#ff5f03",
    ],
    "circle-radius": [
      "step",
      ["get", "count"],
      18,

      5,

      27,

      10,

      35,

      30,

      51,

      50,

      65,

      100,

      90,
    ],
    "text-size": [
      "step",
      ["get", "count"],
      12,
      5,
      14,
      10,
      16,
      30,
      18,
      50,
      21,
      100,
      28,
    ],
  },

  city: {
    "circle-color": [
      "step",
      ["get", "count"],
      "#c973ff",
      5,
      "#ffe11f",
      20,
      "#6edbd9",
      30,
      "#e1ac55",
      40,
      "#f7f00f",
      80,
      "#ff5f03",
    ],
    "circle-radius": [
      "step",
      ["get", "count"],
      21,

      5,

      30,

      20,

      27,

      30,

      40,

      40,

      50,

      80,

      70,
    ],
    "text-size": [
      "step",
      ["get", "count"],
      11,
      5,
      13,
      20,
      15,
      30,
      18,
      40,
      21,
      80,
      28,
    ],
  },
};
type MapBoxStyling = {
  "circle-color":
    | string
    | mapboxgl.StyleFunction
    | mapboxgl.Expression
    | undefined;
  "circle-radius":
    | number
    | mapboxgl.StyleFunction
    | mapboxgl.Expression
    | undefined;
  "text-size":
    | number
    | mapboxgl.StyleFunction
    | mapboxgl.Expression
    | undefined;
};
type CircleStyleType = {
  country: MapBoxStyling;
  region: MapBoxStyling;
  city: MapBoxStyling;
};
