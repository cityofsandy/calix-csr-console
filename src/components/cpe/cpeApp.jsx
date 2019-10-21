import React from 'react';
import { Route } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';
import { App } from '../navigation/nav';
import { global } from '../../config';
import CpeSearch from './cpeSearch';

const MODULE_PREFIX = '/cpe';

const cpeDashboard = ({ match }) => (
  <React.Fragment>
    <Container>
      <Row>
        <h1>CPE Page</h1>
      </Row>
      <CpeSearch />
    </Container>
  </React.Fragment>
);

class Cpe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modulePrefix: MODULE_PREFIX,
    };

    document.title = global.header.siteTitleAbv + ' :: CPE Dashboard';
  }

  render() {
    const { modulePrefix, nav } = this.state;

    return (
      <App nav={nav}>
        <div>
          <Route exact path={modulePrefix} component={cpeDashboard} />
        </div>
      </App>
    );
  }
}

export default Cpe;
