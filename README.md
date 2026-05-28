# Menu Control Center

Основной сценарий: **ручная загрузка** цен и продаж (Excel/CSV).

## Страницы
- `/dashboard`
- `/restaurants`
- `/menu-items`
- `/uploads/prices`
- `/uploads/sales`
- `/price-planning`
- `/templates`
- `/changes`

## Локальный запуск
```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app npx prisma migrate deploy
docker compose exec app npx prisma db seed
```

## Проверка без Docker
```bash
npm install
npm run build
```

## Шаблоны
- `price-template.csv`: `restaurantName,category,itemName,costPrice,salePrice,effectiveDate`
- `sales-template.csv`: `restaurantName,saleDate,category,itemName,quantity,revenue`

## Timeweb Cloud
Используйте Docker Compose сценарий выше; после старта обязательно выполнить migrate + seed.
