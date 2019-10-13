import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, Form, Card } from 'react-bootstrap';
import CalixCloud from '../../calix/cloud';
import CalixSmx from '../../calix/smx';
import CpeShow from './cpeShow';
import { getStorage, setStorage } from '../../js/common';

class CpeSearch extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      searchType: 'fsan',
      searchQuery: '',
      loading: false,
      systems: [],

      cloudResultJson: false,
      smxResultJson: [],
    };

    this.cloudInstance = null;
    this.smxInstances = [];
    this.cmsInstances = [];
    
    this.setText = this.setText.bind(this);
    this.setCheckBox = this.setCheckBox.bind(this);
    this.searchAction = this.searchAction.bind(this);
  }

  componentDidMount() {
    const systems = JSON.parse(getStorage('systems'));
    if (systems) {
      this.setState({
        systems,
      }, () => {
        for (let i = 0; i < systems.length; i++) {
          const system = systems[i];
          if (system.type === 'cloud') {
            this.cloudInstance = new CalixCloud(system.username, system.password);
            console.log('Calix Cloud Instance Loaded');
          } else if (system.type === 'smx') {
            const url = (system.https ? 'https://' : 'http') + system.hostname + ':18443';
            this.smxInstances.push(new CalixSmx(system.username, system.password, url));
          }
        }
      });
    } else {
      this.setState({
        systems: [],
      });
    }
  }


  setText(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  setCheckBox(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({
      [target.name]: value,
    });
  }

  searchAction() {
    this.setState({
      cloudResultJson: {},
    }, () => {
      const {
        searchQuery,
        searchType,
      } = this.state;

      switch (searchType) {
        case 'fsan':
          if (this.cloudInstance) {
            this.cloudInstance.getDeviceRecordByFsan(searchQuery).then((success) => {
              this.setState({
                cloudResultJson: success,
              });
            }, (fail) => {
              console.log('fail', fail);
            });
          }

          if (this.smxInstances.length > 0) {
            const smxResultJson = [];
            this.smxInstances.forEach((instance) => {
              instance.getAllDevices().then((success) => {
                const devicePromises = [];

                success.forEach((device) => {
                  devicePromises.push(
                    instance.getOntFromDeviceSerial(device['device-name'], searchQuery),
                  );
                });
                console.log(devicePromises);
                Promise.allSettled(devicePromises).then((values) => {
                  console.log(values);
                  values.forEach((item) => {
                    if (item.status === 'fulfilled') {
                      smxResultJson.push(item.value);
                    }
                  });
                  this.setState({
                    smxResultJson,
                  });
                });
              }, (fail) => {
                console.log('fail', fail);
              });
            });
          }
          break;
        default:
          // default stuff
      }
    });
  }

  render() {
    const {
      searchQuery,
      searchType,
      cloudResultJson,
      smxResultJson,
    } = this.state;
    return (
      <React.Fragment>
        <Card>
          <Card.Body>

            <Row>
              <Col lg={8}>
                <Form.Group controlId="search">
                  <Form.Label>Query String</Form.Label>
                  <Form.Control type="text" placeholder="Enter Search Criteria" name="searchQuery" value={searchQuery} onChange={this.setText} />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group controlId="searchType" name="searchType" value={searchType} onChange={this.setText}>
                  <Form.Label>Parameter</Form.Label>
                  <Form.Control as="select">
                    <option value="fsan"> FSAN</option>
                    <option>...</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col lg={1}>
                <Form.Group>
                  <Form.Label>&nbsp;</Form.Label>
                  <Button variant="primary" onClick={this.searchAction}>Search</Button>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <br /><br />
        <CpeShow cloudResultJson={cloudResultJson} smxResultJson={smxResultJson} />
      </React.Fragment>
    );
  }
}

export default CpeSearch;
