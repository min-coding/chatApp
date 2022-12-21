import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './components/Navigation';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Chat from './pages/Chat';
import Login from './pages/Login';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { AppContext, socket } from './context/appContext';

function App() {
  const user = useSelector((state) => state.user);
  const [rooms, setRooms] = useState([]);
  const [currentRooms, setCurrentRooms] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState([]);
  const [newMessages, setNewMessages] = useState([]);

  return (
    <AppContext.Provider
      value={{
        socket,
        rooms,
        setRooms,
        currentRooms,
        setCurrentRooms,
        members,
        setMembers,
        messages,
        setMessages,
        privateMemberMsg,
        setPrivateMemberMsg,
        newMessages,
        setNewMessages,
      }}
    >
      <BrowserRouter>
        <Navigation></Navigation>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          {!user && (
            <>
              <Route path="/signup" element={<SignUp />}></Route>
              <Route path="/login" element={<Login />}></Route>
            </>
          )}
          <Route path="/chat" element={<Chat />}></Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
