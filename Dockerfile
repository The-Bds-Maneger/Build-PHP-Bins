FROM debian:latest as build
ENV DEBIAN_FRONTEND="noninteractive"
RUN apt update && \
  apt install -y build-essential sudo make wget gzip bzip2 bison git cmake re2c autoconf automake pkg-config libtool* unzip zip tar

# Clone repo
RUN git clone https://github.com/pmmp/php-build-scripts.git /tmp/phpBuild
WORKDIR /tmp/phpBuild

# Build bin
ARG EXTRAARGS="-f -s"
RUN ./compile.sh -j$(nproc) ${EXTRAARGS}

# Create tarball
FROM debian as ziptar1
ENV DEBIAN_FRONTEND="noninteractive"
RUN apt update && apt install -y tar zip
WORKDIR /app/folder
COPY --from=build /tmp/phpBuild/bin/php7 ./
WORKDIR /app
ARG FILENAME="php_pmmp"
RUN cd folder && tar -czf - * > ../${FILENAME}.tar.gz
RUN cd folder && zip -r ../${FILENAME}.zip *

# Return output to folder
FROM scratch AS folder
COPY --from=ziptar1 /app/*.* /
COPY --from=build /tmp/phpBuild/bin/php7 /tarball
