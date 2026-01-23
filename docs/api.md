# API Documentation

### `GET /items`

Retrieves a list of items with support for filtering, sorting, and pagination.

**Query Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `active` | `boolean` | Filter by active status. |
| `tax_applicable` | `boolean` | Filter by tax applicability. |
| `search` | `string` | Perform a partial text search on the item name. |
| `category` | `ObjectId` | Filter by category ID. |
| `subcategory` | `ObjectId` | Filter by subcategory ID. |
| `price_min` | `number` | Filter by minimum price. |
| `price_max` | `number` | Filter by maximum price. |
| `page` | `number` | The page number for pagination. |
| `limit` | `number` | The number of items per page. |
| `sortBy` | `string` | The field to sort by (e.g., `name`, `price`, `createdAt`). |
| `sortOrder` | `string` | The sort order (`asc` or `desc`). |

**Example Response:**

```json
{
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Cappuccino",
      "image": "/images/cappuccino.jpg",
      "pricing": {
        "price": 3.50
      },
      "tax_applicable": true,
      "is_active": true,
      "availability": {},
      "createdAt": "2023-01-01T12:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1
  }
}