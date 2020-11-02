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
    lat: 31,
    lng: 34,
  };
  const mapStyle = {
    height: "calc(100% - 40px)",
    width: "100%",
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
  };
  return (
    <>
      <Resizable
        minWidth="300px"
        minHeight="200px"
        defaultSize={{
          width: "33vw",
          height: "40vh",
        }}
      >
        <Loading loadingComponent={<LoadingCanvas />} loading={loading}>
          <Wrapper>
            <Select onChange={(e) => setFilter(e.target.value)}>
              <option value={"signup"}>sign up events</option>
              <option value={"admin"}>admin events</option>
              <option value={"login"}>login events</option>
              <option value={"/"}>/ events</option>
            </Select>
            <LoadScript googleMapsApiKey={apiKey} loadingElement={LoadingCanvas}>
              <GoogleMap
                mapContainerStyle={mapStyle}
                zoom={0.1}
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
                {Array.isArray(events) && (
                  <MarkerClusterer>
                    {(clusterer) =>
                      events.map((event) => (
                        <Marker
                          key={event._id}
                          position={event.geolocation.location}
                          clusterer={clusterer}
                          title={event.browser}
                        />
                      ))
                    }
                  </MarkerClusterer>
                )}
              </GoogleMap>
            </LoadScript>
          </Wrapper>
        </Loading>
      </Resizable>
    </>
  );
};

export default memo(GoogleMapsTile);

const Select = styled.select`
  background-color: rgb(63, 81, 181);
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
  min-height: 40px;
  cursor: pointer;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  /* transition: background-color 200ms;

  &:hover {
    background-color: rgb(72, 92, 207);
  } */
`;

const Wrapper = styled.div`
  box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
  width: 100%;
  height: 100%;
`;
