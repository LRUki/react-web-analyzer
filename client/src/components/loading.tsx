import React, { FC } from "react";
import { Dimmer, Loader, LoaderProps } from "semantic-ui-react";

export const Loading: FC<LoaderProps> = ({ children, ...props }) => {
  return (
    <Dimmer active>
      <Loader {...props}>{children}</Loader>
    </Dimmer>
  );
};
