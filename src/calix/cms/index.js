import convert from 'xml-js';

class CalixCms {
  constructor(username, password, host) {
    this.username = username;
    this.password = password;
    this.host = host;
    this.url = '/calixCms/' + host + '/cmsexc/ex/netconf';
    this.sessionId = null;
  }

  static responseParse(text) {
    try {
      // lol ok
      const json = JSON.parse(text);
      return json.Envelope.Body;
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
          }
          console.log(this.sessionId);
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

  getSystems() {
    // Log into CMS
    this.login().then(() => {
      console.log(this.sessionId);

      const body = `
        <?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="www.w3.org/2003/05/soap-envelope">
          <soapenv:Body>
          <rpc message-id="2" nodename="AeCMSNetwork" timeout="35000" sessionid="${this.sessionId}" username="${this.username}">
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
                      <type>AeSettings</type>
                      <adv-filters>
                        <adv-filter></adv-filter>
                      </adv-filters>
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
        .then((res) => {
          console.log(res);
          // Log out of CMS when completed
          this.logout().then(() => {
            console.log('logged out');
          }, (logoutRej) => {
            console.error('Error logging out', logoutRej);
          });
        }, (failed) => {
          console.log(failed);
        });
    }, (loginRej) => {
      console.error('Error logging in', loginRej);
    });
  }
}

export default CalixCms;
