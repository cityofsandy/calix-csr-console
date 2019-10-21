import React from 'react';
import { Alert } from 'react-bootstrap';

const GenericAlert = ({ message, variant }) => {
  const alert = message && variant ? (
    <React.Fragment>
      <br />
      <Alert variant={variant}>
        {message}
      </Alert>
    </React.Fragment>
  ) : null;
  return alert;
};

export default GenericAlert;
