import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';

export default function MessageForm() {
  const [message, setMessage] = useState('');
  const user = useSelector((state) => state.user);

  const { socket, currentRooms, setMessages, messages, privateMemberMsg } =
    useContext(AppContext);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const messageEndRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }

  const todayDate = getFormattedDate();

  // watch for socket to emit a 'room-messages' event
  socket.off('room-messages').on('room-messages', (roomMessages) => {
    // console.log('roomMessages:', roomMessages);
    // console.log('messages:', messages);
    setMessages(roomMessages);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ':' + minutes;
    const roomId = currentRooms;
    //sends these values to server
    socket.emit('message-room', roomId, message, user, time, todayDate);
    setMessage('');
  };

  return (
    <>
      <div className="message-output">
        {!user && <div className="alert alert-danger"> Please login </div>}
        {user && !privateMemberMsg?._id && (
          <div className="alert alert-info">You are in {currentRooms}</div>
        )}
        {user && privateMemberMsg?._id && (
          <div className='alert alert-info conversation-info'>
            You are chatting with {privateMemberMsg.name}
            <img src={privateMemberMsg.image} alt='profile img' className='conversation-profile-picture'></img>
          </div>
        )}
        {user &&
          messages.map(({ _id: date, messagesByDate }, index) => (
            <div key={index}>
              <p className="alert alert-info text-center message-date-indicator">
                {date}
              </p>
              {messagesByDate?.map(
                ({ content, time, from: sender }, msgIndex) => (
                  <div
                    key={msgIndex}
                    className={
                      sender?.email == user?.email
                        ? 'message'
                        : 'incoming-message'
                    }
                  >
                    <div className="message-inner">
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={sender.picture}
                          style={{
                            width: 35,
                            height: 35,
                            objectFit: 'cover',
                            marginRight: 10,
                            borderRadius: 50,
                          }}
                        ></img>
                        <p className="message-sender">
                          {sender._id == user?._id ? 'You' : sender.name}
                        </p>
                      </div>
                      <p className="message-content">{content}</p>
                      <p className="message-timestamp-left">{time}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        <div ref={messageEndRef}></div>
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Your message"
                disabled={!user}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  console.log(message);
                }}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button type="submit" variant="primary" disabled={!user}>
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
