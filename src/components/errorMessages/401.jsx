import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Container, Card } from 'react-bootstrap';

const status401 = () => {
  const errObj = {
    pageTitle: '401',
    title: 'Your page request failed, 401',
    icon: <FontAwesomeIcon icon={faQuestion} />,
    message: null,
    bullets: [
      'Reason: You are not authorized to view this page',
      'Result: You don\'t get to see this page',
      'Resolution: Obtain ability to view this page'
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

export { status401 };
