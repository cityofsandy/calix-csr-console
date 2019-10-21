import React from 'react';
import { Container, Row } from 'react-bootstrap';
import 'react-table/react-table.css';
import { App } from '../navigation/nav';
import { global } from '../../config';
import HomepageAlarms from './homepageAlarms';


const MODULE_PREFIX = '/';


class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modulePrefix: MODULE_PREFIX,
    };

    document.title = global.header.siteTitleAbv + ' :: Homepage';
  }

  render() {
    const { modulePrefix, nav } = this.state;

    return (
      <App nav={nav}>
        <Container>
          <Row>
            <h1>Homepage</h1>
          </Row>
          <Row>
            <HomepageAlarms />
          </Row>
        </Container>
      </App>
    );
  }
}

export default Homepage;
