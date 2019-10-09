import React from 'react';
import { Redirect } from 'react-router-dom';

const trim = (str, length, fix) => {
  if (str.length > length) {
    if (fix === 'pre') {
      return '... ' + str.substring(str.length - length - 4);
    }
  }
  return str;
};

const setCookie = (cookiename, cookievalue, exdays = 30) => {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = 'expires=' + d.toUTCString();
  document.cookie = cookiename + '=' + cookievalue + ';' + expires + ';path=/;';
  // console.log(cookiename + '=' + cookievalue + ';' + expires + 'path=/;');
};

const getCookie = (cname) => {
  const name = cname + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return null;
};

const setStorage = (name, value) => {
  localStorage.setItem(name, value);
};

const getStorage = (name) => {
  return localStorage.getItem(name);
};

const parseGetVars = (location) => {
  const $_GET = {};
  if (location.toString().indexOf('?') !== -1) {
    const query = location
      .toString()
      // get the query string
      .replace(/^.*?\?/, '')
      // and remove any existing hash string (thanks, @vrijdenker)
      .replace(/#.*$/, '')
      .split('&');

    for (let i = 0, l = query.length; i < l; i++) {
      const aux = query[i].split('=');
      $_GET[aux[0]] = decodeURIComponent(aux[1]);
    }
  }
  return $_GET;
};


const checkPermission = (groups, desired, redirect = true) => {
  for (let i = 0; i < desired.length; i++) {
    if (groups.includes('admin') || groups.includes(desired[i])) {
      return true;
    }
  }
  if (redirect) {
    return (<Redirect to="/denied" />);
  }
  return false;
};

const jsDateToMysql = (date) => {
  return date.toJSON().slice(0, 19).replace('T', ' ');
};

export {
  trim,
  parseGetVars,
  getCookie,
  setCookie,
  getStorage,
  setStorage,
  checkPermission,
  jsDateToMysql,
};
