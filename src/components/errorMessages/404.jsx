import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Container, Card } from 'react-bootstrap';


const status404 = () => {
  const errObj = {
    pageTitle: '404',
    title: 'Your page request failed, 404',
    icon: <FontAwesomeIcon icon={faQuestion} />,
    message: null,
    bullets: [
      'Reason: Page does not exist',
      'Result: You fat-fingered the address',
      'Resolution: Don\'t fat-finger addresses',
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

export { status404 };
