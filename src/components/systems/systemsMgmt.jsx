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
      modalHttps: false,
      modalUsername: '',
      modalPassword: '',
      editing: false,
    };

    this.modalTypeSelect = [
      { key: 'cms', value: 'CMS' },
      { key: 'smx', value: 'SMx' },
      { key: 'cloud', value: 'Calix Cloud' },
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
      systems,
    } = this.state;

    let entryObj = null;

    if (modalType === 'cms' || modalType === 'smx') {
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
      systems,
      editingId,
    } = this.state;

    let entryObj = null;

    if (modalType === 'cms' || modalType === 'smx') {
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
