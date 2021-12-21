import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import LoadingSpinner from "./LoadingSpinner";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";
import axios from "axios";
import MarkerItem from "./MarkerItem";

const containerStyle = {
  width: "99vw",
  height: "98vh",
  marginTop: "58px",
};

const center = {
  lat: 45.4939576,
  lng: 12.2392978,
};

const fetchActivites = (groupId) => {
  return axios
    .get(`/api/groups/${groupId}/activities`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

const fetchMaterialOffers = (groupId, filter) => {
  const apiPath = `/api/groups/${groupId}/materialOffers`;
  const filteredApiPath = filter ? apiPath + `?filter=${filter}` : apiPath;
  return axios
    .get(filteredApiPath)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

const fetchMaterialRequests = (groupId, filter) => {
  const apiPath = `/api/groups/${groupId}/materialRequests`;
  const filteredApiPath = filter ? apiPath + `?filter=${filter}` : apiPath;
  return axios
    .get(filteredApiPath)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

function MyComponent(props) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const { language, history, match } = props;
  const texts = Texts[language].groupMaterials;
  const { groupId } = match.params;

  const [map, setMap] = useState(null);
  const [fetchedData, setFetchedData] = useState(false);
  const [materialOffers, setMaterialOffers] = useState([]);
  const [materialRequests, setMaterialRequests] = useState([]);
  const [groupActivities, setGroupActivities] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const materialOffers = await fetchMaterialOffers(groupId);
      const materialRequests = await fetchMaterialRequests(groupId);
      const groupActivities = await fetchActivites(groupId);

      setMaterialOffers(materialOffers);
      setMaterialRequests(materialRequests);
      setGroupActivities(groupActivities);
    }
    fetchData();
    setFetchedData(true);
  }, []);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback((map) => {
    setMap(null);
  }, []);

  const position = {
    lat: 45.4673295,
    lng: 12.2005388,
  };

  return fetchedData ? (
    <React.Fragment>
      <div id="groupMaterialsContainer">
        <div className="row no-gutters" id="groupMembersHeaderContainer">
          <div className="col-2-10">
            <button
              type="button"
              className="transparentButton center"
              onClick={() => history.goBack()}
            >
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="col-7-10 ">
            <h1 className="verticalCenter">{texts.header}</h1>
          </div>
        </div>

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <MarkerItem
              key={1}
              name={"ciao"}
              description={"bello"}
              position={{
                lat: 45.4873295,
                lng: 12.2105388,
              }}
            />

            {groupActivities.map((activity) => {
              return (
                <MarkerItem
                  key={activity.activity_id}
                  name={activity.name}
                  description={activity.description}
                  position={position}
                />
              );
            })}
          </GoogleMap>
        ) : (
          <div></div>
        )}
      </div>
    </React.Fragment>
  ) : (
    <LoadingSpinner />
  );
}

export default React.memo(withLanguage(MyComponent));

// export default withRouter(withLanguage(withStyles(styles)(GroupMaterials)));
