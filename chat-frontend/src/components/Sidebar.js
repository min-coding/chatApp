import React, { useContext, useEffect } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';

export default function Sidebar() {
  const user = useSelector((state) => state.user);
  const {
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
  } = useContext(AppContext);

  const joinRoom = (room, isPublic = true) => {
    if (!user) {
      return alert('Please login');
    }
    socket.emit('join-room', room);
    setCurrentRooms(room);

    if (isPublic) {
      setPrivateMemberMsg(null);
    }

    //dispatch for notifications
  };

  useEffect(() => {
    if (user) {
      setCurrentRooms('general');
      getRooms();
      socket.emit('join-room', 'general');
      socket.emit('new-user');
    }
  }, []);

  socket.off('new-user').on('new-user', (payload) => {
    setMembers(payload);
  });

  if (!user) {
    return <></>;
  }

  function getRooms() {
    fetch('http://localhost:5001/rooms')
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }

  return (
    <>
      <h2> Available Room</h2>
      <ListGroup>
        {rooms.map((room, index) => {
          return (
            <ListGroup.Item
              key={index}
              onClick={() => joinRoom(room)}
              style={{ display: 'flex', justifyContent: 'center' }}
              active={room == currentRooms}
            >
              {room}
              {/* {currentRooms !== room && <span></span>} */}
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      <h2>Members</h2>
      {members.map((member) => (
        <ListGroup.Item key={member.id}> {member.name}</ListGroup.Item>
      ))}
    </>
  );
}
