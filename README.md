# Menu Control Center MVP

Production-ready MVP для сети ресторанов с PostgreSQL, Prisma миграциями и запуском через Docker Compose на Timeweb Cloud.

## Что подготовлено
- Dockerfile
- docker-compose.yml
- .env.example
- prisma/schema.prisma
- prisma/migrations
- prisma/seed.ts

## Локальный запуск через Docker Compose
```bash
docker compose up -d --build
docker compose exec app npx prisma migrate deploy
docker compose exec app npx prisma db seed
```

После этого приложение доступно на `http://localhost:3000`.

## Переменные окружения
Скопируйте `.env.example` в `.env` при локальной разработке:
```bash
cp .env.example .env
```

Содержимое `.env.example`:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## Timeweb Cloud
1. Подключите репозиторий в Timeweb Cloud.
2. Запустите сервис через Docker Compose.
3. Убедитесь, что переменные окружения заданы как в `.env.example`.
4. Выполните миграции и seed командами:
```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npx prisma db seed
```

## Роли
- admin
- manager
- viewer

## Тестовые данные seed
- Рестораны: Клёво Москва, Клёво Ростов, Клёво Сочи
- Меню, снимки цен и плановые изменения
