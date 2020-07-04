import React, { FC } from "react";
import styled from "styled-components";
import css from "@styled-system/css";
import {
  background,
  BackgroundProps,
  borders,
  BordersProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  grid,
  GridProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
  boxShadow,
  BoxShadowProps,
} from "styled-system";

type StyledSystemProps = TypographyProps &
  SpaceProps &
  LayoutProps &
  ColorProps &
  PositionProps &
  FlexboxProps &
  GridProps &
  BackgroundProps &
  BordersProps &
  BoxShadowProps;

const styledSystemProps = [
  typography,
  space,
  layout,
  color,
  position,
  flexbox,
  grid,
  background,
  borders,
  boxShadow,
];

export type ViewProps = StyledSystemProps &
  React.HtmlHTMLAttributes<HTMLDivElement> & { aboveMap?: boolean };

export const View = React.forwardRef(
  (props: ViewProps, ref: React.Ref<HTMLElement>) => {
    return <ViewRoot {...props}>{props.children}</ViewRoot>;
  }
);

const ViewRoot = styled("div")<ViewProps>(
  (props) =>
    props.aboveMap ? css({ zIndex: "1!important", position: "absolute" }) : {},
  styledSystemProps
);

export const Flexbox: FC<ViewProps> = (props) => {
  return (
    <View display="flex" {...props}>
      {props.children}
    </View>
  );
};
