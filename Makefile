.PHONY: help build up down restart logs clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build all Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d
	@echo ""
	@echo "✅ BrainBug is running!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:5001"
	@echo "MongoDB:  mongodb://localhost:27017"

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## View logs from all services
	docker-compose logs -f

logs-backend: ## View backend logs
	docker-compose logs -f backend

logs-frontend: ## View frontend logs
	docker-compose logs -f frontend

logs-mongodb: ## View MongoDB logs
	docker-compose logs -f mongodb

clean: ## Stop and remove all containers, networks, and volumes
	docker-compose down -v
	docker system prune -f

rebuild: ## Rebuild and restart all services
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

dev-backend: ## Run backend in development mode (local)
	cd brainbug-backend && npm run dev

dev-frontend: ## Run frontend in development mode (local)
	cd brainbug-frontend && npm run dev

install-backend: ## Install backend dependencies
	cd brainbug-backend && npm install

install-frontend: ## Install frontend dependencies
	cd brainbug-frontend && npm install

test-backend: ## Run backend tests
	cd brainbug-backend && npm test

status: ## Show status of all services
	docker-compose ps
