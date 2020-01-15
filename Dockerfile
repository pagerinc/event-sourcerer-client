FROM node:12.14-alpine@sha256:fe2cd1b5a9faf21497b73b37f24ad391ac39e72167e435217e9009c836e6da5d

RUN apk add --no-cache tini=0.18.0-r0

ENTRYPOINT ["/sbin/tini", "--"]

ARG NPM_TOKEN
WORKDIR /home/node/app

COPY ./.aptible /Procfile

COPY package.json package-lock.json .npmrc /home/node/app/
RUN chown -R node /home/node \
	&& apk add --no-cache --virtual .build-deps \
		g++=9.2.0-r3 \
		gcc=9.2.0-r3 \
		make=4.2.1-r2 \
		python=2.7.16-r3 \
	&& npm install --quiet --production \
	&& npm cache clean --force \
	&& rm .npmrc \
	&& apk del .build-deps

COPY . /home/node/app
RUN rm .npmrc

EXPOSE 3000
USER node

ARG VCS_REF="96655a6"
ARG BUILD_ID="073fbe44-0546-4d9f-9e73-8db7eef9990a"
ARG VERSION="1.0.0"

ENV VCS_REF="$VCS_REF" \
	BUILD_ID="$BUILD_ID" \
	VERSION="$VERSION"

CMD ["npm", "start", "-s"]