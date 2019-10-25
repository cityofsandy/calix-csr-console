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

  pullAlarms(node, xmlBody) {
    let xmlBodyTest = xmlBody;

    if (!xmlBody) {
      xmlBodyTest = `
        <action-type>show-alarms</action-type>
        <action-args/>
      `;
    }
    const totalAlarms = [];

    const body = `
      <soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope">
        <soapenv:Body>
          <rpc message-id="1" nodename="NTWK-${node.name}" sessionid="${this.sessionId}" username="${this.username}">
            <action>
              ${xmlBodyTest}
            </action>
          </rpc>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
    return new Promise((resolve, reject) => {
      this.xmlSoapRequest(body)
        .then((success) => {
          // Check for last alarm in list for filter
          let alarms = success['rpc-reply']['action-reply'];
          if (Object.entries(success['rpc-reply']['action-reply']).length === 0) {
            resolve([]);
          } else {
            alarms = alarms.alarm;
            //const alarms = success['rpc-reply']['action-reply'].alarm;
            // console.log('pulled alarms', alarms);
            if (alarms.length === 1) {
              totalAlarms.push(alarms[0]);
              resolve(totalAlarms);
            } else if (!Array.isArray(alarms)) {
              resolve([alarms]);
            } else {
              for (let i = 0; i < alarms.length; i++) {
                totalAlarms.push(alarms[i]);
                if (i + 1 === alarms.length) {
                  // last one
                  const queryObject = {
                    'action-type': 'show-alarms',
                    'action-args': {
                      'start-instance': alarms[i].object,
                      'after-alarm': alarms[i]['alarm-type'],
                    },
                  };
                  // console.log('more alarms, coming up...', queryObject);
                  const xml = convert.js2xml(queryObject, { compact: true, ignoreComment: true, spaces: 4 });
                  this.pullAlarms(node, xml).then((success2) => {
                    // console.log(success2);
                    resolve(totalAlarms.concat(success2));
                  }, (failed2) => {
                    console.log('failed');
                    reject(failed2);
                  });
                }
              }
            }
          }
        }, (failed) => {
          reject(failed);
        });
    });
  }

  getAlarms(node) {
    return new Promise((resolve, reject) => {
      // Log into CMS
      this.login().then(() => {
        this.pullAlarms(node).then((res) => {
          resolve({ node, alarms: res });
          this.logout();
        }, (rej) => {
          this.logout();
          reject(rej);
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

  getRgMgmtUsage(node, id) {
    return new Promise((resolve, reject) => {
      // Log into CMS
      this.login().then(() => {
        const body = `
          <soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope">
            <soapenv:Body>
              <rpc message-id="1" nodename="NTWK-${node.name}" sessionid="${this.sessionId}" username="${this.username}">
                <get-config>
                  <source>
                    <running/>
                  </source>
                  <filter type="subtree">
                    <top>
                      <object>
                        <type>System</type>
                        <id/>
                        <children>
                          <type>OntRg</type>
                          <attr-list>admin subscr-id descr mgmt-mode wan-protocol static-ip static-ip-mask static-ip-gw pri-dns-server sec-dns-server pppoe-user pppoe-password config-file-instance mgmt-prof tr69-eth-svc tr69-out-tag tr69-in-tag disable-on-batt pbit-map set-remote-access-secs</attr-list>
                          <attr-filter>
                            <mgmt-prof>
                              <type>OntRgMgmtProf</type>
                              <id>
                                <ontrgmgmtprof>${id}</ontrgmgmtprof>
                              </id>
                            </mgmt-prof>
                          </attr-filter>
                        </children>
                      </object>
                    </top>
                  </filter>
                </get-config>
              </rpc>
            </soapenv:Body>
          </soapenv:Envelope>
        `;
        this.xmlSoapRequest(body)
          .then((success) => {
            //const promises = [];

            const onts = success['rpc-reply'].data.top.object.children.child;

            if (onts.length > 0) {
              const ontId = onts[0].id.ont._text;
              this.updateOntRgProfile(node, 5, ontId).then((suc) => {
                this.logout().then(() => {
                  if (onts.length > 1) {
                    resolve(onts[1].id.ont._text);
                  } else {
                    resolve(false);
                  }
                }, (logoutRej) => {
                  reject(new Error(logoutRej));
                });
              }, (failed) => {
                this.logout();
              });
            }
            // onts.forEach((x) => {
            //   const ontId = x.id.ont._text;
            //   console.log(ontId);
            //   promises.push(
            //     ,
            //   );
            // });

            // Promise.allSettled(promises).then(() => {
            //   console.log('Promsies finished');
            //   this.logout().then(() => {
            //     resolve(success);
            //   }, (logoutRej) => {
            //     reject(new Error(logoutRej));
            //   });
            // });
          }, (failed) => {
            this.logout();
            reject(failed);
          });
      }, (loginRej) => {
        reject(new Error(loginRej));
      });
    });
  }

  updateOntRgProfile(node, newRgId, ontId) {
    return new Promise((resolve, reject) => {
      const body = `
      <?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Body>
          <rpc message-id="175" nodename="NTWK-${node.name}" sessionid="${this.sessionId}" username="${this.username}">
            <edit-config>
              <target>
                <running/>
              </target>
              <config>
                <top>
                  <object operation="merge" >
                    <type>OntRg</type>
                    <id>
                      <ont>${ontId}</ont>
                      <ontslot>8</ontslot>
                      <ontrg>1</ontrg>
                    </id>
                    <mgmt-prof>
                      <type>OntRgMgmtProf</type>
                      <id>
                        <ontrgmgmtprof>${newRgId}</ontrgmgmtprof>
                      </id>
                    </mgmt-prof>
                  </object>
                </top>
              </config>
            </edit-config>
          </rpc>
        </soapenv:Body>
      </soapenv:Envelope>
      `;
      this.xmlSoapRequest(body)
        .then((success) => {
          console.log(`Successful RG update for ${ontId}`, success['rpc-reply']);
          resolve(success);
        }, (failed) => {
          console.log(`Failed to update RG for ${ontId}`, failed);
          reject(failed);
        });
    });
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
