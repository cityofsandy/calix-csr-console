import React from 'react';
import { Route } from 'react-router-dom';

import { App } from '../navigation/nav';
import { global } from '../../config';
import ServiceProvider from './serviceProvider';

const MODULE_PREFIX = '/systems';

class Systems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modulePrefix: MODULE_PREFIX,
    };

    document.title = global.header.siteTitleAbv + ' :: Service Provider';
  }

  render() {
    const { modulePrefix, nav } = this.state;

    return (
      <App nav={nav}>
        <div>
          <Route exact path={modulePrefix} component={ServiceProvider} />
        </div>
      </App>
    );
  }
}

export default Systems;
