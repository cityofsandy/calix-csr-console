# Calix CSR Console
This repo provides example and common actions that a CSR might use when looking up or troulbeshooting a CPE across various Calix Management Systems. 
* CMS
* SMx
* Calix Cloud

## Run docker instance
```docker pull gbrewster/calix-csr-console```
```docker run -p 9000:9000 gbrewster/calix-csr-console```

## Development
The project contains two main pieces. Due to CORS on Calix Cloud and browsers, a proxy must be used to pass basic auth header information. The other being a static html file and dependencies. When running in a dev environment, you can use webpack's build in development server. In production, you can use express as a proxy as well as serving the production ui files. 

### Prerequisites
1) Clone Repo
2) Install NPM/Node JS
3) Inside root directory, run ```npm insall``

### Building
You can build an instance using webpack by running ```npm run build```
You can build and run a development instance ```npm run server``` will build the project and start a local dev server at localhost:9000

### Production Building
To build a production instance of the service, run ```npm run build-prod && npm run build-prod-server``` this will build the UI and server proxy

### Running a Production Instance 
```npm start``` - This will only work if the project has been built

### Build and Run With Docker
```docker build . -t calix-csr-console```
```docker run -p 9000:9000 calix-csr-console```
