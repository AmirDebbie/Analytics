import React, { useCallback, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Resizable } from "re-resizable";
import axios from "axios";
import { Loading } from "react-loading-wrapper";
import LoadingCanvas from "./LoadingCanvas";
import TextField from "@material-ui/core/TextField";
import { convertDateToString, getOffset, today } from "./dateHelpers";
import { Wrapper, H2 } from "./GoogleMapsTile";

interface daySessions {
  date: string;
  count: number;
}

const SessionsByDay = () => {
  const [offset, setOffset] = useState<number>(0);
  const [events, setEvents] = useState<daySessions[] | undefined>(undefined);

  const getData = useCallback(async () => {
    const { data } = await axios.get(`http://localhost:3001/events/by-days/${offset}`);
    setEvents(data);
  }, [offset]);

  useEffect(() => {
    getData();
  }, [offset, getData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setOffset(Math.floor(getOffset(event.target.value)));
  };

  return (
    <Resizable
      minWidth="300px"
      minHeight="200px"
      defaultSize={{
        width: "33vw",
        height: "40vh",
      }}
    >
      <Loading loadingComponent={<LoadingCanvas />} loading={!events}>
        <Wrapper>
          <H2>Sessions By Days In a Single Week</H2>
          <TextField
            label="Date"
            type="date"
            style={{ height: "50px", width: "100%" }}
            InputProps={{
              inputProps: { min: "2020-05-01", max: convertDateToString(today) },
            }}
            defaultValue={convertDateToString(today)}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <div style={{ height: "calc(100% - 70px)", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={events} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="count" stroke="#8884d8" name="Sessions" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Wrapper>
      </Loading>
    </Resizable>
  );
};

export default SessionsByDay;
