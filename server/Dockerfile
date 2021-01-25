FROM node:14.15-slim
WORKDIR /usr/src/app

# tini: https://github.com/krallin/tini#using-tini
# alternative: dumb-init
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# 3000 for API
EXPOSE 3000

# Copy files over in server folder. If we mount a volume (for dev), it overrides the files
COPY . /usr/src/app/

RUN npm install && npm cache clean --force
# Production version
# RUN npm ci --only=production && npm cache clean --force

# Run as nonroot user for better security
RUN useradd -u 2000 edrop_backend_user
USER edrop_backend_user

# So that node doesn't start as PID 1
ENTRYPOINT ["/tini", "--"]
CMD ["/bin/bash", "initialize.sh"]
