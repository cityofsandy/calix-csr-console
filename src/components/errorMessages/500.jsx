import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import { Container, Card } from 'react-bootstrap';

const status500 = () => {
  const errObj = {
    pageTitle: '500',
    title: 'Your page request failed, 500',
    icon: <FontAwesomeIcon icon={faFire} className="text-danger" />,
    message: null,
    bullets: [
      'Reason: Internal Server Error',
      'Result: Server is broke',
      'Resolution: Contact your system administrator',
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

export { status500 };
