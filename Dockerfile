FROM node:8.9.4-alpine

RUN addgroup -S nupp && adduser -S -g nupp nupp

ENV HOME=/home/nupp

COPY ./src $HOME/src
COPY ./build $HOME/build
COPY ./package.json $HOME/
COPY ./.babelrc $HOME/
COPY ./webpack.common.js $HOME/
COPY ./webpack.prod.js $HOME/

RUN node -v

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init

WORKDIR $HOME

RUN chown -R nupp:nupp $HOME/* /usr/local/ && \
    chmod +x /usr/local/bin/dumb-init && \
    npm cache clean --force&& \
    npm install --silent --progress=false && \
    npm run build-prod && npm run build-prod-server && \
    npm prune --production && \
    chown -R nupp:nupp $HOME/*

USER nupp

EXPOSE 9000

CMD ["dumb-init", "npm", "start"]