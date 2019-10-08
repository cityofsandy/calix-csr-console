import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Container, Card } from 'react-bootstrap';

const lockout = () => {
  const errObj = {
    pageTitle: 'Account Disabled',
    title: 'Your account is disabled',
    icon: <FontAwesomeIcon icon={faLock} className="text-danger" />,
    message: null,
    bullets: [
      'Reason: Your user has been deactivated',
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

export { lockout };
