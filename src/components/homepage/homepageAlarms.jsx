import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, Form, Card, Spinner, Container, Table } from 'react-bootstrap';
import AlarmAlert from '../common/alerts';
import CalixSmx from '../../calix/smx';
import CalixCms from '../../calix/cms';
import { getStorage, setStorage } from '../../js/common';

class HomePageAlarms extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      loading: false,
      systems: [],
      alertVariant: null,
      alertMessage: null,

      smxResultJson: [],
      cmsResultJson: [],
    };

    this.systems = [];
    this.smxInstances = [];
    this.cmsInstances = [];
  }

  componentDidMount() {
    const systems = JSON.parse(getStorage('systems'));
    if (systems) {
      this.systems = systems;
      for (let i = 0; i < systems.length; i++) {
        const system = systems[i];
        if (system.type === 'smx') {
          const url = (system.https ? 'https://' : 'http://') + system.hostname + (system.https ? ':18443' : ':18080');
          this.smxInstances.push(new CalixSmx(system.username, system.password, url));
          console.log('Calix SMx Instance Loaded');
        } else if (system.type === 'cms') {
          const url = (system.https ? 'https://' : 'http://') + system.hostname + (system.https ? ':18443' : ':18080');
          this.cmsInstances.push(new CalixCms(system.username, system.password, url, system.cmsNodes));
          console.log('Calix CMS Instance Loaded');
        }
      }
      // this.getSmxAlarms();
      // this.getCmsAlarms();
    } else {
      this.systems = [];
    }
  }

  setAlert(alertMessage, alertVariant) {
    this.setState({
      alertVariant,
      alertMessage,
    });
  }

  getSmxAlarms() {
    const {
      smxResultJson,
    } = this.state;
    const alarmPromises = [];


    this.smxInstances.forEach((instance) => {
      alarmPromises.push(instance.getAlarms());
    });

    Promise.allSettled(alarmPromises).then((values) => {
      values.forEach((item) => {
        if (item.status === 'fulfilled') {
          smxResultJson.push({
            host: 'untitled',
            alarms: item.value,
          });
        }
      });
      this.setState({
        smxResultJson,
      }, () => {
        console.log(smxResultJson);
      });
    });
  }

  getCmsAlarms() {
    const {
      cmsResultJson,
    } = this.state;
    const alarmPromises = [];

    this.cmsInstances.forEach((instance) => {
      const devices = instance.getSystems();

      devices.forEach((device) => {
        alarmPromises.push(
          instance.getAlarms(device),
        );
      });
      Promise.allSettled(alarmPromises).then((values) => {
        // console.log(values);
        values.forEach((item) => {
          if (item.status === 'fulfilled') {
            console.log(item);
            //cmsResultJson.push(item.value);
          }
        });
        this.setState({
          cmsResultJson,
        });
      });
    });
  }


  render() {
    const {
      smxResultJson,
      cmsResultJson,
      alertMessage,
      alertVariant,
      loading,
    } = this.state;
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col lg={12}>
              <AlarmAlert variant={alertVariant} message={alertMessage} />
              <h2>SMx Alerts</h2>
              <Table responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Device Name</th>
                    <th>Device Type</th>
                    <th>Port</th>
                    <th>Alarm Name</th>
                    <th>Service Affecting</th>
                    <th>Category</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  { smxResultJson.map((server) => {
                    return server.alarms.map((alarm, idx) => {
                      return (
                        <tr>
                          <td>{idx + 1}</td>
                          <td>{alarm['device-name']}</td>
                          <td>{alarm.deviceType}</td>
                          <td>{alarm.port}</td>
                          <td>{alarm['condition-type']}</td>
                          <td>{alarm.serviceAffecting}</td>
                          <td>{alarm.category}</td>
                          <td>{alarm.description}</td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </Table>

            </Col>
          </Row>
        </Container>
        <br />
        <br />
        { loading ? (
          <center>
            <h1>
              <Spinner animation="grow" />
              Loading...
            </h1>
          </center>
        ) : (
          <h1> LOL</h1>
          // <CpeShow cloudResultJson={cloudResultJson} smxResultJson={smxResultJson} cmsResultJson={cmsResultJson} />
        )}
      </React.Fragment>
    );
  }
}

export default HomePageAlarms;
