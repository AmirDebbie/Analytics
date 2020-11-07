import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Wrapper, H2 } from "./GoogleMapsTile";
import { Resizable } from "re-resizable";
import axios from "axios";
import { Loading } from "react-loading-wrapper";
import LoadingCanvas from "./LoadingCanvas";
import { Event } from "../models/event";
interface Pages {
  url: string;
  count: number;
}

const PageViews = () => {
  const [events, setEvents] = useState<Pages[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/events/all-filtered?type=pageView`);
        const pageViewEvents: Event[] = data.events;
        if (pageViewEvents) {
          const pages: Pages[] = Array.from(
            new Set(pageViewEvents.map((event: Event) => event.url))
          ).map((url) => {
            return {
              url,
              count: 0,
            };
          });
          for (let i = 0; i < pageViewEvents.length; i++) {
            const index = pages.findIndex((page) => page.url === pageViewEvents[i].url);
            if (index !== -1) {
              pages[index].count++;
            }
          }
          setEvents(
            pages.map((page) => {
              return { ...page, url: page.url.split("3000/")[1] };
            })
          );
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

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
        <Wrapper>
          <H2>Page Views</H2>
          <Loading loadingComponent={<LoadingCanvas />} loading={!events}>
            <div style={{ height: "calc(100% - 20px)", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={events}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="url" />
                  <YAxis dataKey="count" />
                  <Tooltip />
                  <Bar dataKey="count" barSize={40} fill="#4a5f8d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Loading>
        </Wrapper>
      </Resizable>
    </>
  );
};

export default PageViews;
