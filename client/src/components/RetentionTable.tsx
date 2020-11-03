import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { weeklyRetentionObject } from "../models";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { convertDateToString, today } from "./dateHelpers";
import { Resizable } from "re-resizable";
import { Loading } from "react-loading-wrapper";
import LoadingCanvas from "./LoadingCanvas";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import { TableBody } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import { Wrapper } from "./GoogleMapsTile";

const calcUsersPercentage = (
  data?: weeklyRetentionObject[]
): { allUsers: number; percentageArray: number[] } => {
  if (!data) {
    return {
      allUsers: 0,
      percentageArray: [],
    };
  }
  let numbersReturnedForEveryWeek: number[] = new Array(data[0].weeklyRetention.length).fill(0);
  let allUsers = 0;
  data.forEach((week) => {
    allUsers += week.newUsers;
    week.weeklyRetention.forEach((percent: number, i: number) => {
      if (!isNaN((percent * week.newUsers) / 100) && (percent * week.newUsers) / 100 !== null) {
        numbersReturnedForEveryWeek[i] += (percent * week.newUsers) / 100;
      }
    });
  });

  return {
    allUsers,
    percentageArray: numbersReturnedForEveryWeek.map((numUsers) =>
      isNaN(+((numUsers / allUsers) * 100)) ? 0 : +((numUsers / allUsers) * 100).toFixed(2)
    ),
  };
};

export default function RetentionTable() {
  const [retention, setRetention] = useState<weeklyRetentionObject[]>([]);
  const [offset, setOffset] = useState<number>(new Date().valueOf());
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setOffset(new Date(event.target.value).valueOf());
  };

  const getRetention = useCallback(async (offset: number) => {
    const { data } = await axios.get(`http://localhost:3001/events/retention?dayZero=${offset}`);
    setRetention(data);
  }, []);

  useEffect(() => {
    getRetention(offset);
  }, [offset, getRetention]);

  return (
    <Resizable
      minWidth="300px"
      minHeight="200px"
      defaultSize={{
        width: "33vw",
        height: "40vh",
      }}
    >
      {retention && (
        <Loading loading={retention.length === 0} loadingComponent={<LoadingCanvas />}>
          <Wrapper>
            <TextField
              label="Date"
              type="date"
              style={{ height: "50px", width: "100%" }}
              InputProps={{
                inputProps: { min: "2020-05-01", max: convertDateToString(today) },
              }}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TableContainer style={{ width: "100%", height: "calc(100% - 50px)" }}>
              <Table size="small" style={{ border: "1px solid #DDDDDD" }}>
                <TableHead>
                  <TableRow style={{ background: "#f1f1f1" }}>
                    <TableCell></TableCell>
                    {retention[0]?.weeklyRetention.map((percentages: number, i: number) => (
                      <TableCell key={uuidv4()}>Week Number {i}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <b>{retention.length > 0 && calcUsersPercentage(retention).allUsers}</b>
                    </TableCell>
                    {retention.length > 0 &&
                      calcUsersPercentage(retention).percentageArray.map(
                        (percent: number, index: number) => (
                          <TableCell key={uuidv4()}>
                            <b>{percent + "%"}</b>
                          </TableCell>
                        )
                      )}
                  </TableRow>
                  {retention.map((weeklyRetentionData: weeklyRetentionObject) => (
                    <TableRow key={uuidv4()}>
                      <TableCell>
                        {weeklyRetentionData.start} - {weeklyRetentionData.end}
                        <P>{weeklyRetentionData.newUsers} new users</P>
                      </TableCell>
                      {weeklyRetentionData.weeklyRetention.map((cell: number, index: number) => (
                        <TableCell key={uuidv4()}>
                          {cell === null
                            ? "not available"
                            : weeklyRetentionData.newUsers === 0
                            ? "no users singed up"
                            : cell + "%"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Wrapper>
        </Loading>
      )}
    </Resizable>
  );
}

const P = styled.p`
  padding: 0;
  margin: 0;
  font-size: 10px;
  color: grey;
`;
