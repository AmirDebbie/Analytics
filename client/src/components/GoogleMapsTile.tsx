import React, { useState, useCallback, useEffect, memo } from "react";
import { Resizable } from "re-resizable";
import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api";
import axios from "axios";
import styled from "styled-components";
import { Event } from "../models/event";
import { Loading } from "react-loading-wrapper";
import LoadingCanvas from "./LoadingCanvas";

const apiKey = "AIzaSyA1jO5KCUbo5ifKHb4LK5ilBN2Fp0NZb5Y";
const GoogleMapsTile = () => {
  const [map, setMap] = useState<google.maps.Map | undefined>(undefined);
  const [events, setEvents] = useState<Event[] | undefined>(undefined);
  const [filter, setFilter] = useState<string>("signup");
  const [loading, setLoading] = useState<boolean>(true);

  const getFilteredMap = useCallback(async () => {
    console.log("filtering", filter);
    setLoading(true);
    const { data: filteredEvents } = await axios.get(
      `http://localhost:3001/events/all-filtered?type=${filter}`
    );
    setEvents(filteredEvents.events);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    getFilteredMap();
  }, [filter]);

  const onUnmount = useCallback(() => {
    setMap(undefined);
  }, []);

  const onLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const center = {
    lat: 31.46667,
    lng: 34.783333,
  };
  const mapStyle = { height: "85%", width: "100%" };
  return (
    <>
      <Resizable
        defaultSize={{
          width: "33vw",
          height: "40vh",
        }}
      >
        <Loading loadingComponent={<LoadingCanvas />} loading={loading}>
          <Select onChange={(e) => setFilter(e.target.value)}>
            <option value={"signup"}>signup</option>
            <option value={"admin"}>admin</option>
            <option value={"login"}>login</option>
            <option value={"/"}>/</option>
          </Select>
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={mapStyle}
              zoom={1}
              onLoad={onLoad}
              onUnmount={onUnmount}
              center={center}
              options={{
                streetViewControl: false,
                center: center,
                mapTypeControl: false,
                fullscreenControl: false,
                scaleControl: true,
              }}
            >
              {Array.isArray(events) &&
                events.map((event) => {
                  return (
                    <Marker
                      key={event._id}
                      position={event.geolocation.location}
                      // animation={window.google.maps.Animation.DROP}
                    />
                  );
                })}
            </GoogleMap>
          </LoadScript>
        </Loading>
      </Resizable>
    </>
  );
};

export default memo(GoogleMapsTile);

const Select = styled.select`
  background-color: #0563af;
  color: white;
  padding: 5px;
  width: 250px;
  border: none;
  font-size: 20px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  -webkit-appearance: button;
  appearance: button;
  outline: none;
  width: 100%;
  height: 15%;
  min-height: 35px;
`;
