import React from 'react';
import { ListGroup } from 'react-bootstrap';

export default function Sidebar() {
  const rooms = ['firstroom', 'secondroom', 'thirdroom'];
  return (
    <>
      <h2> Available Room</h2>
      <ListGroup>
        {rooms.map((room, index) => {
          return <ListGroup.Item key={index}>{room}</ListGroup.Item>;
        })}
      </ListGroup>
      <h2>Members</h2>
    </>
  );
}
