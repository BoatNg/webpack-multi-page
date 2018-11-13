FROM nginx:1.14-alpine
MAINTAINER Lidongsheng <lidongsheng@afanticar.com>

ENV APP="/usr/src/app" \
    INSTALL_PACKAGES="tzdata"

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/' /etc/apk/repositories \
    && apk add --update --no-cache $INSTALL_PACKAGES \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata \
    && rm -rf /var/cache/apk/*

WORKDIR $APP

ADD dist .
