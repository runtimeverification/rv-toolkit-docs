FROM ubuntu:bionic

RUN    apt-get update        \
    && apt-get install --yes \
        curl                 \
        git                  \

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN    apt-get update               \
    && apt-get upgrade --yes        \
    && apt-get install --yes nodejs

ARG USER_ID=1000
ARG GROUP_ID=1000
RUN    groupadd -g $GROUP_ID user                     \
    && useradd -m -u $USER_ID -s /bin/sh -g user user

USER user:user

RUN mkdir -p /home/user/.ssh
ADD --chown=user:user package/ssh/config /home/user/.ssh/
RUN    chmod go-rwx -R /home/user/.ssh                                \
    && git config --global user.email "admin@runtimeverification.com" \
    && git config --global user.name  "RV Jenkins"

RUN curl -L https://github.com/github/hub/releases/download/v2.14.0/hub-linux-amd64-2.14.0.tgz -o /home/user/hub.tgz
RUN cd /home/user && tar xzf hub.tgz

ENV PATH=/home/user/hub-linux-amd64-2.14.0/bin:$PATH
