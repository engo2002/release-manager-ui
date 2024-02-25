FROM node:lts-alpine as build
WORKDIR /usr/local/app
COPY package.json /usr/local/app
COPY package-lock.json /usr/local/app
RUN npm ci --legacy-peer-deps
COPY ./ /usr/local/app/
RUN npm run build

FROM nginx:latest
COPY --from=build /usr/local/app/dist/release-manager-ui /usr/share/nginx/html/release-manager-ui
COPY build/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/company-time-ui/assets/env.template.js > /usr/share/nginx/html/company-time-ui/assets/env.js && exec nginx -g 'daemon off;'"]
