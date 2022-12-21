import React, { useContext, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';

export default function MessageForm() {
  const [message, setMessage] = useState('');
  const user = useSelector((state) => state.user);

  const { socket, currentRooms, setMessages, messages, privateMemberMsg } =
    useContext(AppContext);

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
    /** console.log(roomMessages) */
    setMessages(roomMessages);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    const time = today.getHours + ':' + minutes;
    const roomId = currentRooms;
    //sends these values to server
    socket.emit('message-room', roomId, message, user, time, todayDate);
    setMessage('');
  };

  return (
    <>
      <div className="message-output">
        {!user && <div className="alert alert-danger"> Please login </div>}
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
                onChange={(e) => setMessage(e.target.value)}
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
