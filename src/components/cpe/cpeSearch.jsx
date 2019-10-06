import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

class CpeSearch extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>1 of 2</Col>
          <Col>2 of 2</Col>
        </Row>
        <Row>
          <Col>1 of 3</Col>
          <Col>2 of 3</Col>
          <Col>3 of 3</Col>
        </Row>
      </Container>
    );
  }
}

export default CpeSearch;
