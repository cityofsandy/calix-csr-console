import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Container, Card } from 'react-bootstrap';

const denied = () => {
  const errObj = {
    pageTitle: 'Denied Request',
    title: 'Your page request was denied',
    icon: <FontAwesomeIcon icon={faLock} className="text-danger" />,
    message: null,
    bullets: [
      'Reason: Your user account lacks the required permissions',
      'Result: Denied access to requested information',
      'Resolution: Obtain proper permissions to access data',
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

export { denied };
