

if (process.env.NODE_ENV !== 'production') {
  console.log('**** Development mode enabled ****');
}

if ((navigator.appName === 'Microsoft Internet Explorer'
  || !!(navigator.userAgent.match(/Trident/)
  || navigator.userAgent.match(/rv:11/)))
  && (window.location.pathname.indexOf('/incompatible') === -1)) {
  window.location.href = '/incompatible';
}

const global = {
  header: {
    siteTitleAbv: 'CSR',
    siteTitle: 'Calix CSR',
    version: '0.0.0.1',
  },
};


// IE11 Object.Assign Polyfill
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    value: function assign(target) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      const to = Object(target);

      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (let nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true,
  });
}

export { global };
