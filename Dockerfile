FROM node:14
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install
RUN npm install ngx-pagination --save
RUN npm install -g @angular/cli@10.2.0
COPY . /app
EXPOSE 4200
CMD npm start
