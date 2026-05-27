# Menu Control System

Веб-система контроля меню ресторанов на **Next.js + TypeScript + Prisma**.

## Локальный запуск
```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run build
npm run start
```

## Railway (рекомендуется PostgreSQL)

### 1) Создайте проект
- Создайте новый проект в Railway.
- Подключите GitHub-репозиторий с этим кодом.
- Добавьте сервис **PostgreSQL** в тот же проект.

### 2) Переменные окружения приложения
Укажите в Railway Variables:

```env
DATABASE_PROVIDER="postgresql"
DATABASE_URL="${{Postgres.DATABASE_URL}}"
SESSION_SECRET="long-random-secret"
NODE_ENV="production"
```

> Для Railway используйте PostgreSQL. SQLite на Railway не подходит для production-сценария.

### 3) Команды сборки и запуска
Конфиг уже задан в `railway.json`:
- Build: `npm run build`
- Start: `npm run start:railway`

`start:railway` выполняет:
1. `npm run db:deploy` (`prisma db push`)
2. `npm run start`

Это гарантирует применение схемы БД перед стартом сервера.

### 4) Первый деплой
После деплоя при необходимости заполните тестовые данные в Railway Shell:
```bash
npm run db:seed
```

## ENV переменные
- `DATABASE_PROVIDER` = `sqlite` или `postgresql`
- `DATABASE_URL`
- `SESSION_SECRET`

## Примеры файлов для импорта
- Меню: `public/examples/menu-template.csv`
- Продажи: `public/examples/sales-template.csv`


## Примечание по Railway Security Scanner
- Используйте Next.js версии `^14.2.35` или выше, чтобы пройти security-gate Railway.


## Troubleshooting Railway build
- If build fails at `prisma generate` with `P1012`, check `prisma/schema.prisma`: all Prisma keywords must stay in English (`datasource`, `model`, `enum`, `String`, etc.).
- Do not auto-translate code files in editors/browsers.
- Run locally before deploy:
```bash
npm run verify:prisma
```


## Prisma datasource note
- `prisma/schema.prisma` uses fixed `provider = "postgresql"` for Railway compatibility.
- Switch to SQLite only by editing schema provider locally before `db:push`.


## Anti-crash build settings
- Build scripts avoid `prisma validate` during install/build to prevent false deployment failures when environment variables are not injected yet.
- Railway start command still applies schema with `npm run db:deploy` before app start.
