import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Container, Card } from 'react-bootstrap';

const status400 = () => {
  const errObj = {
    pageTitle: '400',
    title: 'Your page request failed, 400',
    icon: <FontAwesomeIcon icon={faQuestion} />,
    message: null,
    bullets: [
      'Reason: The request could not be understood',
      'Result: Page could not be loaded',
      'Resolution: Make sure you can be understood',
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

export { status400 };
