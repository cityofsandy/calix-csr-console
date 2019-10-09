import base64 from 'base-64';

class CalixCloud {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.url = 'calixCloud/';
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
          'Content-Type': 'text/plain;charset=UTF-8',
          Authorization: `Basic ${base64.encode(`${this.username}:${this.password}`)}`,
        },
        body: bodyArgs,
        ...fetchOptions,
      };

      fetch(url, options).then((response) => {
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

  getDeviceRecordByFsan(fsan) {
    return this.jsonRequest(this.url + 'device', 'get', { serialNumber: fsan });
  }

}

export default CalixCloud;
