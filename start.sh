#!/bin/bash

# 로컬 IP 자동 감지
HOST_IP=$(hostname -I | awk '{print $1}')

if [ -z "$HOST_IP" ]; then
  HOST_IP="localhost"
fi

echo "========================================="
echo " Starting Poem App"
echo " Backend API:  http://${HOST_IP}:5000"
echo " Frontend:     http://${HOST_IP}:3000"
echo " Frontend HTTPS: https://${HOST_IP}:3443  (카메라 사용)"
echo "========================================="

# .env 파일에서 환경변수 로드
if [ -f ./backend/.env ]; then
  export $(grep -v '^#' ./backend/.env | xargs)
fi

# HOST_IP 내보내기
export HOST_IP

# Docker Compose 실행
docker compose up --build "$@"
