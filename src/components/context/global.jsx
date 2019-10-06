import { createContext } from 'react';

export const screenSizes = {
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200,
};


export const UserContext = createContext({
  userData: {},
});

export const ThemeContext = createContext({
  animationSpeed: 300,
  screenSizes,
  footer: {
    rightText: '',
    copyrightLink: 'http://ci.sandy.or.us',
    copyrightName: 'City of Sandy',
    copyrightYear: '2018',
  },
});
