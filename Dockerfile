FROM debian:latest
ENV DEBIAN_FRONTEND="noninteractive"
RUN apt update && \
  apt install -y build-essential sudo make wget gzip bzip2 bison git cmake re2c autoconf automake pkg-config libtool* unzip zip tar

# Add non root user
ARG USER_NAME=copiler
ARG USER_ID=1000
ARG GROUP_ID=${USER_ID}
ARG USER_PASSWORD=copiler123
RUN groupadd -g ${GROUP_ID} ${USER_NAME} && \
  useradd -m -u ${USER_ID} -g ${GROUP_ID} -G sudo -s /bin/bash ${USER_NAME} && \
  echo "${USER_NAME}:${USER_PASSWORD}" | chpasswd && \
  echo "${USER_NAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

WORKDIR /home/${USER_NAME}
USER ${USER_NAME}

# Clone repo
RUN git clone https://github.com/pmmp/php-build-scripts.git phpBuild
WORKDIR /home/${USER_NAME}/phpBuild

# Build bin
ARG EXTRAARGS=""
RUN ./compile.sh -j$(nproc) ${EXTRAARGS}

FROM scratch
COPY /home/${USER_NAME}/phpBuild/bin/* /
