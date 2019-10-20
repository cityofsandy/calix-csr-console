import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Modal, Button, Form, Table } from 'react-bootstrap';
import { getStorage, setStorage } from '../../js/common';
import CsrAlert from '../common/alerts';
import { faGlasses } from '@fortawesome/free-solid-svg-icons';

class CpeSearch extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      systems: [],
      alertVariant: null,
      alertMessage: null,
      modalShow: false,
      modalHostname: '',
      modalType: 'cms',
      modalCmsNodes: [],
      modalHttps: false,
      modalUsername: '',
      modalPassword: '',
      modalAddCmsHostName: '',
      modalAddCmsHostType: 'e7',
      editing: false,
    };

    this.modalTypeSelect = [
      { key: 'cms', value: 'CMS' },
      { key: 'smx', value: 'SMx' },
      { key: 'cloud', value: 'Calix Cloud' },
    ];

    this.modalAddCmsHostSelect = [
      { key: 'e7', value: 'E7' },
    ];

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.setText = this.setText.bind(this);
    this.setCheckBox = this.setCheckBox.bind(this);
    this.addManagementSystem = this.addManagementSystem.bind(this);
    this.addManagementSystemAction = this.addManagementSystemAction.bind(this);
    this.editManagementSystem = this.editManagementSystem.bind(this);
    this.editManagementSystemAction = this.editManagementSystemAction.bind(this);
    this.deleteManagementSystemAction = this.deleteManagementSystemAction.bind(this);
    this.addCmsHost = this.addCmsHost.bind(this);
  }

  componentDidMount() {
    this.readSystems();
  }

  componentWillUnmount() {
  }

  setAlert(alertMessage, alertVariant) {
    this.setState({
      alertVariant,
      alertMessage,
    });
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

  handleClose() {
    this.setState({
      modalShow: false,
    }, () => {
      this.readSystems();
    });
  }

  handleShow() {
    this.setState({
      modalShow: true,
    });
  }

  readSystems() {
    const systems = JSON.parse(getStorage('systems'));
    if (systems) {
      this.setState({
        systems,
      });
      this.setAlert(null, null);
    } else {
      this.setState({
        systems: [],
      });
      console.log('no systems found');
      this.setAlert('No systems storage found...', 'warning');
    }
  }

  addManagementSystem() {
    this.setState({
      modalType: 'cms',
      modalHostname: '',
      modalHttps: true,
      modalUsername: '',
      modalPassword: '',
      modalCmsNodes: [],
      editing: false,
      editingId: null,
    });
    this.handleShow();
  }

  addManagementSystemAction() {
    const {
      modalType,
      modalHostname,
      modalHttps,
      modalUsername,
      modalPassword,
      modalCmsNodes,
      systems,
    } = this.state;

    let entryObj = null;

    if (modalType === 'cms') {
      entryObj = {
        type: modalType,
        hostname: modalHostname,
        username: modalUsername,
        password: modalPassword,
        https: modalHttps,
        cmsNodes: modalCmsNodes,
      };
    } else if (modalType === 'smx') {
      entryObj = {
        type: modalType,
        hostname: modalHostname,
        username: modalUsername,
        password: modalPassword,
        https: modalHttps,
      };
    } else {
      entryObj = {
        type: modalType,
        hostname: modalHostname,
        username: modalUsername,
        password: modalPassword,
      };
    }

    systems.push(entryObj);
    setStorage('systems', JSON.stringify(systems));
    this.setState({
      systems,
    });
    this.handleClose();
  }

  editManagementSystem(idx) {
    const { systems } = this.state;
    const item = systems[idx];
    this.setState({
      modalType: item.type || 'cms',
      modalHostname: item.hostname || '',
      modalHttps: item.https || false,
      modalUsername: item.username || '',
      modalPassword: item.password || '',
      modalCmsNodes: item.cmsNodes || [],
      modalAddCmsHostName: '',
      modalAddCmsHostType: 'e7',
      editing: true,
      editingId: idx,
    });
    this.handleShow();
  }

  editManagementSystemAction() {
    const {
      modalType,
      modalHostname,
      modalHttps,
      modalUsername,
      modalPassword,
      modalCmsNodes,
      systems,
      editingId,
    } = this.state;

    let entryObj = null;

    if (modalType === 'cms') {
      entryObj = {
        type: modalType,
        hostname: modalHostname,
        username: modalUsername,
        password: modalPassword,
        https: modalHttps,
        cmsNodes: modalCmsNodes,
      };
    } else if (modalType === 'smx') {
      entryObj = {
        type: modalType,
        hostname: modalHostname,
        username: modalUsername,
        password: modalPassword,
        https: modalHttps,
      };
    } else {
      entryObj = {
        type: modalType,
        hostname: '',
        username: modalUsername,
        password: modalPassword,
      };
    }

    systems[editingId] = entryObj;
    setStorage('systems', JSON.stringify(systems));
    this.setState({
      systems,
    });
    this.handleClose();
  }

  deleteManagementSystemAction() {
    const {
      systems,
      editingId,
    } = this.state;
    systems.splice(editingId, 1);
    setStorage('systems', JSON.stringify(systems));
    this.setState({
      systems,
    });
    this.handleClose();
  }

  addCmsHost() {
    const {
      modalCmsNodes,
      modalAddCmsHostName,
      modalAddCmsHostType,
    } = this.state;

    const newUnit = {
      name: modalAddCmsHostName,
      type: modalAddCmsHostType,
    };
    modalCmsNodes.push(newUnit);
    this.setState({
      modalCmsNodes,
    }, () => {
      console.log(this.state.modalCmsNodes);
    });
  }

  deleleCmsNode(idx) {
    const {
      modalCmsNodes,
    } = this.state;
    modalCmsNodes.splice(idx, 1);
    //setStorage('systems', JSON.stringify(systems));
    this.setState({
      modalCmsNodes,
    });
  }


  render() {
    const {
      systems,
      alertMessage,
      alertVariant,
      modalShow,
      modalType,
      modalHostname,
      modalHttps,
      modalUsername,
      modalPassword,
      modalAddCmsHostName,
      modalAddCmsHostType,
      modalCmsNodes,
      editing,
    } = this.state;

    return (
      <React.Fragment>
        <Container>
          <br />
          <h1> Systems Management </h1>
          <CsrAlert variant={alertVariant} message={alertMessage} />
          <Button variant="primary" onClick={this.addManagementSystem}>
            Add Management System
          </Button>
          <br />
          <br />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Type</th>
                <th>Hostname</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              { systems.map((system, idx) => {
                return (
                  <tr>
                    <td>{system.type}</td>
                    <td>{system.hostname}</td>
                    <td>
                      <Button variant="primary" onClick={() => this.editManagementSystem(idx)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
        <Modal show={modalShow} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add/Modify Management System</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form>
              <Form.Group>
                <Form.Label>System Type</Form.Label>
                <Form.Control as="select" value={modalType} name="modalType" onChange={this.setText}>
                  { this.modalTypeSelect.map(item => <option value={item.key}>{item.value}</option>)}
                </Form.Control>
              </Form.Group>
              { (modalType === 'cms' || modalType === 'smx') && (
                <React.Fragment>
                  <Form.Group>
                    <Form.Label>Hostname/IP</Form.Label>
                    <Form.Control type="text" placeholder="localhost" name="modalHostname" value={modalHostname} onChange={this.setText} />
                  </Form.Group>
                  <Form.Group>
                    <Form.Check type="checkbox" label="Https" name="modalHttps" checked={modalHttps} onChange={this.setCheckBox} />
                  </Form.Group>
                </React.Fragment>
              )}
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Username" name="modalUsername" value={modalUsername} onChange={this.setText} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="text" placeholder="Password" name="modalPassword" value={modalPassword} onChange={this.setText} />
              </Form.Group>
              { (modalType === 'cms') && (
                <Row>
                  <hr />
                  <Col lg={5}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label>Node Name</Form.Label>
                      <Form.Control type="text" placeholder="Node Name" name="modalAddCmsHostName" value={modalAddCmsHostName} onChange={this.setText} />
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Label>Node Type</Form.Label>
                    <Form.Control as="select" value={modalAddCmsHostType} name="modalAddCmsHostType" onChange={this.setText}>
                      { this.modalAddCmsHostSelect.map(item => <option value={item.key}>{item.value}</option>)}
                    </Form.Control>
                  </Col>
                  <Col lg={3}>
                    <Form.Label>&nbsp;</Form.Label>
                    <Button variant="primary" onClick={this.addCmsHost} disabled={!modalAddCmsHostName || /\s/.test(modalAddCmsHostName)}>
                      Add Host
                    </Button>
                  </Col>
                  <Col lg={12}>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Node Name</th>
                          <th>Type</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        { modalCmsNodes.map((node, idx) => {
                          return (
                            <tr>
                              <td>{node.name}</td>
                              <td>{node.type}</td>
                              <td>
                                <Button variant="danger" onClick={() => this.deleleCmsNode(idx)}>
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              )}
            </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            { !editing ? (
              <Button variant="primary" onClick={this.addManagementSystemAction}>
                Add
              </Button>
            ) : (
              <React.Fragment>
                <Button variant="primary" onClick={this.editManagementSystemAction}>
                  Update
                </Button>
                <Button variant="danger" onClick={this.deleteManagementSystemAction}>
                  Delete
                </Button>
              </React.Fragment>
            )}

          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CpeSearch;
