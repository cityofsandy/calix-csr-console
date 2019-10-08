import React from 'react';
import Alert from 'react-bootstrap/Alert';

// https://learnetto.com/blog/how-to-do-simple-form-validation-in-reactjs

const FormErrors = ({ formErrors }) => {
  let renderElement = false;
  const element = (
    <Alert variant="danger">
      {Object.keys(formErrors).map((fieldName, i) => {
        if (formErrors[fieldName].length > 0) {
          renderElement = true;
          return (
            <p key={i}>{formErrors[fieldName]}</p>
          );
        }
        return '';
      })}
    </Alert>
  );
  return renderElement ? element : null;
};

export default FormErrors;
