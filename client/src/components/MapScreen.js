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

const MapScreen = (props) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const { language, history, match } = props;
  const texts = Texts[language].groupMaterials;
  const { groupId } = match.params;

  // eslint-disable-next-line no-unused-vars
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
  }, [groupId]);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback((map) => {
    setMap(null);
  }, []);

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
            {groupActivities.map((activity) => {
              if (activity.location) {
                return (
                  <MarkerItem
                    key={activity.activity_id}
                    id={activity.activity_id}
                    name={activity.name}
                    description={activity.description}
                    position={activity.location}
                    type="activity"
                    {...props}
                  />
                );
              } else return <div key={activity.activity_id}></div>;
            })}
            {materialOffers.map((offer) => {
              if (offer.location) {
                return (
                  <MarkerItem
                    key={offer.material_offer_id}
                    id={offer.material_offer_id}
                    name={offer.material_name}
                    description={offer.description}
                    position={offer.location}
                    type="offer"
                    {...props}
                  />
                );
              } else return <div key={offer.material_offer_id}></div>;
            })}
            {materialRequests.map((request) => {
              if (request.location) {
                return (
                  <MarkerItem
                    key={request.material_request_id}
                    id={request.material_request_id}
                    name={request.material_name}
                    description={request.description}
                    position={request.location}
                    type="request"
                    {...props}
                  />
                );
              } else return <div key={request.material_request_id}></div>;
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
};

export default React.memo(withLanguage(MapScreen));
