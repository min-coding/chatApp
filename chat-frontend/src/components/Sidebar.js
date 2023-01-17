import { current } from '@reduxjs/toolkit';
import React, { useContext, useEffect } from 'react';
import { ListGroup, ListGroupItem, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';
import { addNotifications, resetNotifications } from '../features/userSlice';

export default function Sidebar() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
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
    socket.emit('join-room', room, currentRooms);
    setCurrentRooms(room);

    if (isPublic) {
      setPrivateMemberMsg(null);
    }

    //dispatch for notifications
    dispatch(resetNotifications(room));
  };

  socket.off('notifications').on('notifications', (room) => {
    if (currentRooms != room) {
      dispatch(addNotifications(room));
    }
  });

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

  function orderIds(id1, id2) {
    if (id1 > id2) {
      return id1 + '-' + id2;
    }
    return id2 + '-' + id1;
  }

  function handlePrivateMemberMsg(member) {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
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
              {currentRooms !== room && (
                <span className="badge rounded-pill bg-primary">
                  {user.newMessages[room]}
                </span>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      <h2>Members</h2>
      <ListGroup>
        {members.map((member) => (
          <ListGroup.Item
            key={member._id}
            active={privateMemberMsg?._id == member?._id}
            onClick={() => handlePrivateMemberMsg(member)}
            disabled={member?._id == user?._id}
          >
            {' '}
            <Row>
              <Col xs={2} className="member-status">
                <img
                  src={member.picture}
                  className="member-status-img"
                  alt="profile-picture"
                ></img>
                {member.status === 'online' ? (
                  <i className="fas fa-circle sidebar-online-status"></i>
                ) : (
                  <i className="fas fa-circle sidebar-offline-status"></i>
                )}
              </Col>
              <Col xs={9}>
                {member.name}
                {member._id === user?._id && '(You)'}
                {member.status === 'offline' && '(Offline)'}
              </Col>
              <Col xs={1}>
                <span className="badge rounded-pill bg-primary">
                  {user.newMessages[orderIds(member._id, user._id)]}
                </span>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}
