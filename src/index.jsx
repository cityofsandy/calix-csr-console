import React, { Suspense, lazy } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoadingScreen from './components/initalLoad/loading';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as HttpStatuses from './components/errorMessages/httpStatus';
import * as ErrPages from './components/errorMessages/errPages';

// Common libraries
import { global } from './config';

// Modules
const Homepage = lazy(() => import('./components/homepage/homepageApp'));
const Cpe = lazy(() => import('./components/cpe/cpeApp'));
const Systems = lazy(() => import('./components/systems/systemsApp'));

document.title = global.header.siteTitleAbv + ' :: Landing Page';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => <Component {...props} />
      }
    />
  );
};

const CsrRouter = () => (
  <Router>
    <Suspense fallback={LoadingScreen}>
      <Switch>
        <PrivateRoute path="/cpe" component={Cpe} />
        <PrivateRoute path="/systems" component={Systems} />
        <PrivateRoute exact path="/" component={Homepage} />

        <Route path="/lockout" component={ErrPages.lockout} />
        <Route path="/blockedip" component={ErrPages.blockedip} />
        <Route path="/denied" component={ErrPages.denied} />
        <Route path="/incompatible" component={ErrPages.incompatible} />
        <Route path="/400" component={HttpStatuses.status400} />
        <Route path="/401" component={HttpStatuses.status401} />
        <Route path="/403" component={HttpStatuses.status403} />
        <Route path="/404" component={HttpStatuses.status404} />
        <Route path="/500" component={HttpStatuses.status500} />
        <Route component={HttpStatuses.status404} />
      </Switch>
    </Suspense>
  </Router>
);

render(
  <CsrRouter />,
  document.getElementById('app'),
);
