.PHONY: setup up down logs restart

## Cria o arquivo .env a partir do .env.example (executa apenas uma vez)
setup:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo ".env criado a partir de .env.example. Edite as variáveis antes de continuar."; \
	else \
		echo ".env já existe. Nenhuma alteração feita."; \
	fi

## Sobe o servidor da API e o banco de dados MySQL via Docker Compose
up:
	docker compose up --build -d

## Para e remove os containers
down:
	docker compose down

## Exibe os logs em tempo real
logs:
	docker compose logs -f

## Reinicia os containers
restart: down up
