import React from 'react';
import { Container, Row, Table } from 'react-bootstrap';

class CpeShow extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.props = props;
  }

  render() {
    const {
      cloudResultJson,
      smxResultJson,
    } = this.props;

    return (
      <React.Fragment>
        {Object.keys(cloudResultJson).length > 0 && (
          <Container>
            <Row>
              <h2>Calix Cloud</h2>
              <Container>
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
              </Container>
            </Row>
          </Container>
        )}

        {smxResultJson.length > 0 && (
          <Container>
            <Row>
              <h2>SMx</h2>
              <Container>
                { smxResultJson.map(item => (
                  <div>
                    <h5>{item['serial-number']}</h5>
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
                          <td>{item.model}</td>
                        </tr>
                        <tr>
                          <td>Current Software Version</td>
                          <td>{item['curr-version']}</td>
                        </tr>
                        <tr>
                          <td>Alternate Software Version</td>
                          <td>{item['alt-version']}</td>
                        </tr>
                        <tr>
                          <td>Access System</td>
                          <td>{item['device-name'] + '-' + item['shelf-id'] + '/' + item['slot-id'] + '/' + item['port-id']}</td>
                        </tr>
                        <tr>
                          <td>ONU MAC Address</td>
                          <td>{item['onu-mac-addr']}</td>
                        </tr>
                        <tr>
                          <td>MTA MAC Address</td>
                          <td>{item['mta-mac-addr']}</td>
                        </tr>
                        <tr>
                          <td>Description</td>
                          <td>{item.description}</td>
                        </tr>
                        <tr>
                          <td>Location</td>
                          <td>{item.location}</td>
                        </tr>
                        <tr>
                          <td>Status</td>
                          <td>{item.status}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                ))}
              </Container>
            </Row>
          </Container>
        )}
      </React.Fragment>
    );
  }
}

export default CpeShow;
