import React from "react";
import { Interpreter } from "xstate";
import axios from "axios";
import GoogleMapsTile from "../components/GoogleMapsTile";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import ErrorBoundry from "../components/ErrorBoundry";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <>
      <ErrorBoundry>
        <GoogleMapsTile />
      </ErrorBoundry>
    </>
  );
};

export default DashBoard;
