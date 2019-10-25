// include dependencies
import express from 'express';
import proxy from 'http-proxy-middleware';
import fallback from 'express-history-api-fallback';
import path from 'path';

// proxy middleware options
const options = {
  target: 'http://www.example.org', // target host
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets
  pathRewrite: {
    '^/api/old-path': '/api/new-path', // rewrite path
    '^/api/remove/path': '/path', // remove base path
  },
  router: {
    // when request.headers.host == 'dev.localhost:3000',
    // override target 'http://www.example.org' to 'http://localhost:8000'
    'dev.localhost:3000': 'http://localhost:8000'
  }
};



const app = express();

app.use('/calixCloud', proxy({
  target: 'https://gcs.calix.com:8444/api',
  pathRewrite: { '^/calixCloud': '' },
  changeOrigin: false,
  secure: false,
}));

app.use('/calixCms', proxy({
  target: 'http://example.com',
  pathRewrite: (urlPath) => { 
    return urlPath.replace(/calixCms\/(http|https):\/\/(.*?)\//g, '');
  },
  changeOrigin: true,
  secure: false,
  logLevel: 'debug',
  router: (req) => {
    return req.path.match(/(http|https):\/\/(.*?)\//g, '')[0];
  },
}));

app.use('/calixSmx', proxy({
  target: 'http://example.com',
  pathRewrite: (urlPath) => { 
    return urlPath.replace(/calixSmx\/(http|https):\/\/(.*?)\//g, '');
  },
  changeOrigin: true,
  secure: false,
  logLevel: 'debug',
  router: (req) => {
    return req.path.match(/(http|https):\/\/(.*?)\//g, '')[0];
  },
}));

app.use('/', express.static(__dirname));
app.use(fallback(path.join(__dirname, 'index.html')));

app.listen(9000);
