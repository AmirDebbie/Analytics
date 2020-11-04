import React, { useState, useEffect, useCallback } from "react";
import { Loading } from "react-loading-wrapper";
import LoadingCanvas from "./LoadingCanvas";
import styled from "styled-components";
import axios from "axios";
import { Event } from "../models";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Geocode from "react-geocode";
import { Wrapper, H2 } from "./GoogleMapsTile";
const apiKey = "AIzaSyAy7WH4vuy7VrxbmHR3-eoBJkdIKf8rCw0";
Geocode.setApiKey(apiKey);

function convertDateToString(date: number) {
  let today = new Date(date);
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const generatedDate = `${yyyy}/${mm}/${dd}`;
  return `${generatedDate}`;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      border: "1px solid black",
      borderRadius: 2,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(12),
      color: "black",
    },
    details: {
      color: "grey",
      fontSize: theme.typography.pxToRem(12),
    },
  })
);

export default function EventLog() {
  const [events, setEvents] = useState<undefined | Event[]>(undefined);
  const [eventsToShow, setEventsToShow] = useState<undefined | Event[]>(undefined);
  const [current, setCurrent] = useState<number>(0);
  const [searchInput, setSearchInput] = useState<string>("");
  const [type, setType] = useState<string>("all");
  const [browser, setBrowser] = useState<string>("all");
  const [sort, setSort] = useState<string>("-date");
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleLoad = () => {
    setEventsToShow(events!.slice(0, current + 10));
    setCurrent((prev) => prev + 10);
  };

  const getUserLocation = useCallback(async (data: Event[]) => {
    let events: Event[] = await Promise.all(
      data.map(async (event: Event) => {
        try {
          const address = await Geocode.fromLatLng(
            event.geolocation.location.lat,
            event.geolocation.location.lng
          );

          return { ...event, geolocation: address.results[0].formatted_address };
        } catch (e) {
          return { ...event, geolocation: null };
        }
      })
    );
    setEvents(events);
    setEventsToShow(events.slice(0, 10));
  }, []);

  const getEvents = useCallback(async () => {
    let query = `?sorting=${sort}`;
    if (type !== "all") {
      query += `&type=${type}`;
    }
    if (browser !== "all") {
      query += `&browser=${browser}`;
    }
    if (searchInput.length > 0) {
      query += `&search=${searchInput}`;
    }
    const { data } = await axios.get(`http://localhost:3001/events/all-filtered${query}`);
    // setEventsToShow(data.events.slice(0, 10));
    getUserLocation(data.events);
    setCurrent(10);
  }, [getUserLocation, browser, sort, type, searchInput]);

  useEffect(() => {
    getEvents();
  }, [sort, searchInput, type, browser, getEvents]);

  return (
    <div style={{ width: "67vw", height: "400px" }}>
      <Wrapper>
        <H2>Event Log</H2>
        <Loading loadingComponent={<LoadingCanvas />} loading={!events}>
          <Grid>
            <div>
              <TextField
                label="Search Events"
                value={searchInput}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                  setSearchInput(e.target.value)
                }
              />
              <br />
              <br />
              <TextField
                select
                label="Type"
                value={type}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                  setType(e.target.value)
                }
                variant="outlined"
                helperText="Please select your event type"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pageView">PageView</MenuItem>
                <MenuItem value="login">Login</MenuItem>
                <MenuItem value="signup">Sign Up</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
              <br />
              <br />
              <TextField
                select
                label="Sort"
                value={sort}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                  setSort(e.target.value)
                }
                variant="outlined"
                helperText="Please select how you want to sort Your Events"
              >
                <MenuItem value="-date">Newest To Oldest</MenuItem>
                <MenuItem value="+date">Oldest To Newest</MenuItem>
              </TextField>
              <br />
              <br />
              <TextField
                select
                label="Browser"
                value={browser}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                  setBrowser(e.target.value)
                }
                variant="outlined"
                helperText="Please select your event browser"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="ie">Internet Explorer</MenuItem>
                <MenuItem value="chrome">Chrome</MenuItem>
                <MenuItem value="safari">Safari</MenuItem>
                <MenuItem value="firefox">Firefox</MenuItem>
                <MenuItem value="edge">Edge</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </div>
            <div
              id="scrollableDiv"
              style={{
                width: "100%",
                height: "330px",
                overflowY: "scroll",
                padding: 7,
                border: "2px solid #D3D3D3",
                borderRadius: 7,
              }}
            >
              <InfiniteScroll
                dataLength={eventsToShow ? eventsToShow.length : 0}
                next={handleLoad}
                scrollableTarget="scrollableDiv"
                hasMore={events ? current < events.length : false}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>No more events to display!</b>
                  </p>
                }
              >
                {eventsToShow &&
                  eventsToShow.map((event, index) => {
                    return (
                      <div className={classes.root}>
                        <Accordion
                          expanded={expanded === `panel${index}`}
                          onChange={handleChange(`panel${index}`)}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>
                              User {event.distinct_user_id}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography className={classes.details}>
                              Event type: {event.name}
                              <br />
                              Date: {convertDateToString(event.date)}
                              <br />
                              Os: {event.os}
                              <br />
                              Browser: {event.browser}
                              <br />
                              {!event.geolocation
                                ? "Address: Not Found"
                                : `Address: ${event.geolocation}`}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    );
                  })}
              </InfiniteScroll>
            </div>
          </Grid>
        </Loading>
      </Wrapper>
    </div>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
`;
