# Menu Control Center

Основной сценарий: ручная загрузка **сводного прейскуранта iiko/Aiko в XLSX** и ручная загрузка продаж.

## Страницы
- `/dashboard`
- `/restaurants`
- `/menu-items`
- `/uploads/prices`
- `/uploads/sales`
- `/price-planning`
- `/templates`
- `/changes`

## Что умеет импорт цен
- принимает `.xlsx/.xls`
- парсит workbook через `xlsx`
- пропускает строки вида `Группа:`
- определяет: `article`, `itemName`, `hallPrice`, `hallMarkupPercent`, `deliveryPrice`, `deliveryMarkupPercent`, `costPrice`
- показывает preview-таблицу
- при подтверждении создаёт `PriceSnapshot` и сохраняет строки по типам прайса: **Зал/Доставка**

## Что умеет импорт продаж
- принимает файл продаж
- preview перед импортом
- сопоставляет блюдо по названию
- сохраняет `SalesReport`/`SalesReportItem`
- считает `grossProfit = revenue - costPrice * quantity`

## Локальный запуск
```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app npx prisma migrate deploy
docker compose exec app npx prisma db seed
```

## Проверка
```bash
npm run build
docker compose up --build
```

## Шаблоны
- `price-template.csv`: `restaurantName,category,itemName,costPrice,salePrice,effectiveDate`
- `sales-template.csv`: `restaurantName,saleDate,category,itemName,quantity,revenue`

## Timeweb Cloud
Используйте Docker Compose сценарий выше; после старта обязательно выполнить migrate + seed.
