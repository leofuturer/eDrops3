FROM node:14.15-slim
WORKDIR /usr/src/app

# tini: https://github.com/krallin/tini#using-tini
# alternative: dumb-init
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

COPY package*.json ./

# RUN npm install && npm cache clean --force
# Production version
RUN npm ci --only=production && npm cache clean --force

# 3000 for API, 465 for email
EXPOSE 3000
EXPOSE 465

# So that node doesn't start as PID 1
ENTRYPOINT ["/tini", "--"]

CMD ["/bin/bash", "initialize.sh"]
