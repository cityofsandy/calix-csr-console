import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
// import { Route } from 'react-router-dom';

import 'react-table/react-table.css';
import { App } from '../navigation/nav';
import { global } from '../../config';

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
        <h1>HOMEPAGE</h1>
      </App>
    );
  }
}

export default Homepage;
