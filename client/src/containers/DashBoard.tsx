import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import ErrorBoundry from "../components/ErrorBoundry";
import GoogleMapsTile from "../components/GoogleMapsTile";
import RetentionTable from "../components/RetentionTable";
import SessionsByDay from "../components/SessionByDay";
import SessionsByHours from "../components/SessionByHour";
import EventLog from "../components/EventLog";
import styled from "styled-components";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <Grid>
      <ErrorBoundry>
        <GoogleMapsTile />
      </ErrorBoundry>
      <ErrorBoundry>
        <SessionsByDay />
      </ErrorBoundry>
      <ErrorBoundry>
        <SessionsByHours />
      </ErrorBoundry>
      <ErrorBoundry>
        <RetentionTable />
      </ErrorBoundry>
      <div style={{ gridColumn: "1/3" }}>
        <ErrorBoundry>
          <EventLog />
        </ErrorBoundry>
      </div>
    </Grid>
  );
};

export default DashBoard;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
  justify-items: center;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;
