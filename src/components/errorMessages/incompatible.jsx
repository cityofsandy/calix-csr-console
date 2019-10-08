import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Container, Card } from 'react-bootstrap';

const incompatible = () => {
  const errObj = {
    pageTitle: 'Bad Browser',
    title: 'Incomptable Browser Detected',
    icon: <FontAwesomeIcon icon={faLock} className="text-danger" />,
    message: null,
    bullets: [
      'Please use a modern browser',
    ],
  };

  return (
    <Container>
      <br />
      <br />
      <br />
      <Card>
        <Card.Header>
          <center>
            <h1>
              {errObj.icon}
              &nbsp;
              {errObj.title}
            </h1>
          </center>
        </Card.Header>
        <Card.Body>
          {
            errObj.bullets.map((bullet, index) => <h4 key={index.toString()}>{bullet}</h4>)
          }
        </Card.Body>
      </Card>
    </Container>
  );
};

export { incompatible };
