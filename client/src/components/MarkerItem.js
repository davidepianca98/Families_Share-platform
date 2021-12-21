import React, { useState } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";

const divStyle = {
  background: `white`,
  padding: 5,
};

const MarkerItem = (props) => {
  const { name, description, position } = props;

  const [show, setShow] = useState(false);

  return (
    <Marker title={name} position={position} onClick={() => setShow(!show)}>
      {show && (
        <InfoWindow position={position}>
          <div style={divStyle}>
            <h1>{name}</h1>
            <p>{description}</p>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default MarkerItem;
