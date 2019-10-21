import convert from 'xml-js';

class CalixCms {
  constructor(username, password, host, nodes) {
    this.username = username;
    this.password = password;
    this.host = host;
    this.url = '/calixCms/' + host + '/cmsexc/ex/netconf';
    this.sessionId = null;
    this.nodes = nodes;
  }

  static responseParse(text) {
    try {
      const json = JSON.parse(text);
      let envelope = null;
      let body = null;

      // Get Envelope
      if (Object.prototype.hasOwnProperty.call(json, 'Envelope')) {
        envelope = json.Envelope;
      } else if (Object.prototype.hasOwnProperty.call(json, 'soapenv:Envelope')) {
        envelope = json['soapenv:Envelope'];
      }

      // Get Body
      if (Object.prototype.hasOwnProperty.call(envelope, 'Body')) {
        body = envelope.Body;
      } else if (Object.prototype.hasOwnProperty.call(envelope, 'soapenv:Body')) {
        body = envelope['soapenv:Body'];
      }

      return body;
    } catch (e) {
      throw new Error('Failed to parse response');
    }
  }

  xmlSoapRequest(xml = '', fetchOptions = {}) {
    const url = this.url;

    return new Promise((resolve, reject) => {
      let responseCode = null;
      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          Accept: 'text/xml',
          'Content-Type': 'text/xml;charset=UTF-8',
        },
        body: xml,
        ...fetchOptions,
      };

      fetch(url, options).then((response) => {
        responseCode = response.status;
        return response.text().then(text => convert.xml2json(text, { compact: true, spaces: 2 }));
      }).then((result) => {
        if (responseCode >= 400) {
          reject(`${result.hasOwnProperty('message') ? result.message : 'No error message provided'}, HTTP code: ${responseCode}`);
        } else {
          const parseResult = CalixCms.responseParse(result);
          resolve(parseResult);
        }
      }).catch((error) => {
        if (responseCode >= 400) {
          reject(`Failed to parse response, HTTP code: ${responseCode}`);
        }
        reject(error.toString());
      });
    });
  }

  login() {
    const body = `
    <?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Body>
        <auth message-id="1">
          <login>
            <UserName>${this.username}</UserName>
            <Password>${this.password}</Password>
          </login>
        </auth>
      </soapenv:Body>
    </soapenv:Envelope>
    `;

    return new Promise((resolve, reject) => {
      this.xmlSoapRequest(body)
        .then((success) => {
          if (parseInt(success['auth-reply'].ResultCode._text, 10) === 0) {
            this.sessionId = parseInt(success['auth-reply'].SessionId._text, 10);
          } else {
            reject(success['auth-reply'].ResultMessage._text);
          }
          resolve();
        }, (failed) => {
          reject(failed);
        });
    });
  }

  logout() {
    const body = `
      <?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Body>
          <auth message-id="2">
            <logout>
              <UserName>${this.username}</UserName>
              <SessionId>${this.sessionId}</SessionId>
            </logout>
          </auth>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    return new Promise((resolve, reject) => {
      this.xmlSoapRequest(body)
        .then(() => {
          resolve();
        }, (failed) => {
          reject(failed);
        });
    });
  }

  getOntFromFsan(node, fsan) {
    return new Promise((resolve, reject) => {
      // Log into CMS
      this.login().then(() => {
        this.showOntSerno(node, fsan)
          .then((res) => {
            // Log out of CMS when completed
            this.logout().then(() => {
              resolve(res);
            }, (logoutRej) => {
              reject(new Error(logoutRej));
            });
          }, (failed) => {
            this.logout();
            reject(failed);
          });
      }, (loginRej) => {
        reject(new Error(loginRej));
      });
    });
  }

  showOntSerno(node, fsan) {
    const trimmedFsan = fsan.length > 6 ? fsan.substr(-6, 6) : fsan;
    const body = `
    <?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Body>
        <rpc message-id="175" nodename="NTWK-${node.name}" sessionid="${this.sessionId}" username="${this.username}">
          <action>
            <action-type>show-ont</action-type>
            <action-args>
              <serno>${trimmedFsan}</serno>
            </action-args>
          </action>
        </rpc>
      </soapenv:Body>
    </soapenv:Envelope>
    `;

    return new Promise((resolve, reject) => {
      this.xmlSoapRequest(body)
        .then((success) => {
          if (Object.prototype.hasOwnProperty.call(success['rpc-reply']['action-reply'], 'match')) {
            const { object } = success['rpc-reply']['action-reply'].match.get;
            const objectConfig = success['rpc-reply']['action-reply'].match['get-config'].object;
            resolve(Object.assign(object, objectConfig));
          } else {
            reject(new Error('No results found'));
          }
        }, (failed) => {
          reject(failed);
        });
    });
  }

  getSystems() {
    return this.nodes || [];
  }

  testConnection() {
    return new Promise((resolve, reject) => {
      // Log into CMS
      this.login().then(() => {
        // Log out of CMS when completed
        this.logout().then(() => {
          resolve();
        }, (logoutRej) => {
          reject(new Error(logoutRej));
        });
      }, (loginRej) => {
        reject(new Error(loginRej));
      });
    });
  }
}

export default CalixCms;
