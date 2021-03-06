import base64 from 'base-64';

class CalixSmx {
  constructor(username, password, url) {
    this.username = username;
    this.password = password;
    this.url = '/calixSmx/' + url + '/rest/v1';
  }

  jsonRequest(urlParam, type = 'get', args = {}, fetchOptions = {}) {
    let url = urlParam;
    let bodyArgs = null;
    if (type === 'get' || type === 'delete') {
      // GET Request
      let count = 0;
      Object.keys(args).forEach((key) => {
        if (count > 0) {
          url += '&';
        } else {
          url += '?';
        }
        url += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
        count++;
      });
    } else if (type === 'post' || type === 'put') {
      // POST Request
      try {
        bodyArgs = JSON.stringify(args);
      } catch (e) {
        bodyArgs = null;
      }
    }

    return new Promise((resolve, reject) => {
      let responseCode = null;
      const options = {
        method: type,
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: `Basic ${base64.encode(`${this.username}:${this.password}`)}`,
        },
        body: bodyArgs,
        ...fetchOptions,
      };

      fetch(url, options).then((response) => {
        // console.log(response);
        responseCode = response.status;
        return response.json();
      }).then((result) => {
        if (responseCode >= 400) {
          reject(`${result.hasOwnProperty('message') ? result.message : 'No error message provided'}, HTTP code: ${responseCode}`);
        } else {
          resolve(result);
        }
      }).catch((error) => {
        if (responseCode >= 400) {
          reject(`Failed to parse response, HTTP code: ${responseCode}`);
        }
        reject(error.toString());
      });
    });
  }

  getOntFromDeviceSerial(deviceName, fsan) {
    return new Promise((resolve, reject) => {
      const deviceOnt = this.jsonRequest(this.url + '/config/device/' + deviceName + '/ont/', 'get', { 'serial-number': fsan });
      deviceOnt.then((deviceOntSuccess) => {
        const deviceDiscoveredOnt = this.jsonRequest(this.url + '/config/device/' + deviceName + '/discovered-ont/' + fsan, 'get', {});
        deviceDiscoveredOnt.then((deviceDiscoveredOntSuccess) => {
          resolve(Object.assign(deviceOntSuccess, deviceDiscoveredOntSuccess));
        }, (deviceDiscoveredOntFailed) => {
          reject(deviceDiscoveredOntFailed);
        });
      }, (deviceOntFailed) => {
        reject(deviceOntFailed);
      });
    });
  }

  getAllDevices() {
    return this.jsonRequest(this.url + '/config/device', 'get', {});
  }

  search(query) {
    console.log(this.jsonRequest(this.url + '/es/search', 'get', {_search: query}));
  }

  testConnection() {
    return this.jsonRequest(this.url + '/security/user/' + this.username, 'get');
  }

  getAlarms() {
    return this.jsonRequest(this.url + '/fault/alarm', 'get', { limit: 1000 });
  }
}

export default CalixSmx;
