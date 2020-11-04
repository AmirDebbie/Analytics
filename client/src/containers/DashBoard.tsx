import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import ErrorBoundary from "../components/ErrorBoundary";
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
      <ErrorBoundary>
        <GoogleMapsTile />
      </ErrorBoundary>
      <ErrorBoundary>
        <SessionsByDay />
      </ErrorBoundary>
      <ErrorBoundary>
        <SessionsByHours />
      </ErrorBoundary>
      <ErrorBoundary>
        <RetentionTable />
      </ErrorBoundary>
      <EventLogWrapper>
        <ErrorBoundary>
          <EventLog />
        </ErrorBoundary>
      </EventLogWrapper>
    </Grid>
  );
};

export default DashBoard;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  justify-items: center;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const EventLogWrapper = styled.div`
  grid-column: 1/3;

  @media (max-width: 1100px) {
    grid-column: 1;
  }
`;
