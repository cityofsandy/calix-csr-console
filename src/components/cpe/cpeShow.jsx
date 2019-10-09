import React from 'react';
import { Button, Row, Table } from 'react-bootstrap';

class CpeShow extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.props = props;
  }



  render() {
    const {
      cloudResultJson,
    } = this.props;
    return (
      <Row>
        {Object.keys(cloudResultJson).length > 0 && (
          <React.Fragment>
            <h2>Calix Cloud</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Model</td>
                  <td>{cloudResultJson.modelName}</td>
                </tr>
                <tr>
                  <td>Mode</td>
                  <td>{cloudResultJson.opMode}</td>
                </tr>
                <tr>
                  <td>Registration ID</td>
                  <td>{cloudResultJson.registrationId}</td>
                </tr>
                <tr>
                  <td>FSAN</td>
                  <td>{cloudResultJson.serialNumber}</td>
                </tr>
                <tr>
                  <td>Current Software Version</td>
                  <td>{cloudResultJson.softwareVersion}</td>
                </tr>
                <tr>
                  <td>WAN Access Type</td>
                  <td>{cloudResultJson.wanAccessType}</td>
                </tr>
                <tr>
                  <td>IP Address</td>
                  <td>{cloudResultJson.ipAddress}</td>
                </tr>
                <tr>
                  <td>Subnet Mask</td>
                  <td>{cloudResultJson.subnetMask}</td>
                </tr>
                <tr>
                  <td>Gateway</td>
                  <td>{cloudResultJson.defaultGateway}</td>
                </tr>
                <tr>
                  <td>MAC Address</td>
                  <td>{cloudResultJson.macAddress}</td>
                </tr>
              </tbody>
            </Table>
          </React.Fragment>
        )}
      </Row>
    );
  }
}

export default CpeShow;
