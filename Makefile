#Запуск контейнеров
up:
	docker compose up -d --build

#Миграции БД (создает таблицы)
# migrate:
# 	docker compose -f docker-compose-local.yml exec fastapi poetry run alembic upgrade head

#Синхронизирует таблицу doc с папкой, содержащей предзагруженные документы 
# init-docs:
# 	docker compose -f docker-compose-local.yml exec fastapi poetry run python3 check_doc_table.py

#Вывод логов из всех контейнеров в консоль
logs:
	docker compose logs -f

# #Вывод ловов из контейнеров gigachat_api и fastapi в консоль
# logs-giga:
# 	docker compose logs -f gigachat_api fastapi

#Остановка контейнеров
down:
	docker compose down

#Перезапуск контейнеров
restart:
	docker compose down
	docker compose up -d --build

# #Запуск автотестов
# pytest:
# 	docker compose -f docker-compose-local.yml exec gigachat_api poetry run pytest