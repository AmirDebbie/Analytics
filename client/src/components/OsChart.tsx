import React, { useEffect, useState, useCallback } from "react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Resizable } from "re-resizable";
import axios from "axios";
import { Loading } from "react-loading-wrapper";
import LoadingCanvas from "./LoadingCanvas";
import { Event } from "../models/event";
import { Wrapper, H2 } from "./GoogleMapsTile";

interface Os {
  os: string;
  count: number;
}

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  count: number;
  index: number;
}

const COLORS = ["#E63946", "#2a9d8f", "#A8DADC", "#457B9D", "#1D3557", "#f77f00"];
const RAD = Math.PI / 180;

const OsChart = () => {
  const [events, setEvents] = useState<Os[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/events/all`);
        const allEvents: Event[] = data;
        if (allEvents) {
          const allOs: Os[] = Array.from(new Set(allEvents.map((event: Event) => event.os))).map(
            (os) => {
              return {
                os,
                count: 0,
              };
            }
          );
          for (let i = 0; i < allEvents.length; i++) {
            const index = allOs.findIndex((page) => page.os === allEvents[i].os);
            if (index !== -1) {
              allOs[index].count++;
            }
          }
          setEvents(
            allOs.map((os) => {
              return { os: os.os, count: Math.round((os.count * 100) / allEvents.length) };
            })
          );
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  let renderLabel = useCallback(
    ({ cx, cy, midAngle, innerRadius, outerRadius, count, index }: LabelProps) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RAD);
      const y = cy + radius * Math.sin(-midAngle * RAD) * 1.6;

      return (
        <text
          x={index === 1 || index === 4 ? x - 8 : x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {`${count}%`}
        </text>
      );
    },
    []
  );

  return (
    <>
      <Resizable
        minWidth="300px"
        minHeight="300px"
        defaultSize={{
          width: "33vw",
          height: "40vh",
        }}
      >
        <Wrapper>
          <H2>OS Chart</H2>
          <Loading loadingComponent={<LoadingCanvas />} loading={!events}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={events}
                  dataKey="count"
                  nameKey="os"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={renderLabel}
                  labelLine={false}
                  fill="#8884d8"
                >
                  {events?.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Loading>
        </Wrapper>
      </Resizable>
    </>
  );
};

export default OsChart;
