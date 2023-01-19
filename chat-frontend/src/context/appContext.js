import { io } from 'socket.io-client';
import React from 'react';

const SOCKET_URL = process.env.REACT_APP_DEV_BASE_URL;

//app context
export const AppContext = React.createContext();
export const socket = io(SOCKET_URL);
