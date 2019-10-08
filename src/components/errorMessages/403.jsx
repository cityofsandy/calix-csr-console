import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Container, Card } from 'react-bootstrap';

const status403 = () => {
  const errObj = {
    pageTitle: '403',
    title: 'Your page request failed, 403',
    icon: <FontAwesomeIcon icon={faQuestion} />,
    message: null,
    bullets: [
      'Reason: Page is forbidden',
      'Result: The server is cranky',
      'Resolution: Give it some love, maybe it will open up',
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

export { status403 };
