.PHONY: help install install-backend install-frontend run-backend run-frontend build-backend docker-up docker-down docker-build

help:
	@echo "Available commands:"
	@echo "  make install         - Install dependencies for all components"
	@echo "  make build-backend   - Build the NestJS backend"
	@echo "  make run-backend     - Run NestJS backend in dev mode"
	@echo "  make run-frontend    - Run Frontend in dev mode"
	@echo "  make docker-up       - Start services with Docker"
	@echo "  make docker-down     - Stop Docker services"
	@echo "  make docker-build    - Rebuild Docker images and start services"

env ?= development

env.set:
	@if [ ! -f .config/backend/environments/.env.$(env) ] || [ ! -f .config/frontend/environments/.env.$(env) ]; then \
	  echo "\033[1;32mMissing environment file: .env.$(env).\033[0m"; \
	  exit 1; \
	fi
	cp .config/backend/environments/.env.$(env) ./backend/.env
	cp .config/frontend/environments/.env.$(env) ./frontend/.env
	@echo "\033[1;32m$(env) environment variables are set for both components.\033[0m"

install: install-backend install-frontend

install-backend:
	cd backend && npm install --legacy-peer-deps

install-frontend:
	cd frontend && npm install --legacy-peer-deps

run-backend:
	cd backend && npm run start:dev

run-frontend:
	cd frontend && npm run dev -- --host

build-backend:
	cd backend && npm run build

docker-up:
	docker-compose up

docker-down:
	docker-compose down

docker-build:
	docker-compose up --build

run-all:
	(make run-backend) & (make run-frontend)