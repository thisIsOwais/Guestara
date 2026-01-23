# Guestara Backend – Restaurant & Services Platform

A scalable backend system for restaurants and service-based businesses, built with Node.js, TypeScript, Express, and MongoDB.

This project was developed as a hiring assignment, focusing on real-world business logic, clean architecture, and scalability, not just CRUD APIs.

## Features

- **Hierarchy:** Category → Subcategory → Item hierarchy
- **Dynamic Pricing:** A powerful pricing engine that resolves prices at runtime.
- **Tax Inheritance:** Tax values cascade from Item → Subcategory → Category.
- **Booking-Ready:** Availability and booking-ready structure.
- **Add-ons:** Support for add-ons and add-on groups.
- **Full-Featured API:** Search, filtering, pagination, and sorting.
- **Data Integrity:** Implements soft deletes to ensure no data loss.
- **Clean Architecture:** A clean, service-layer architecture for maintainability.

## Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **MongoDB (Mongoose)**
- **Zod (Request Validation)**

## System Design Overview

**Controller → Service → Domain / Engine → Database**

- **Controllers:** Handle HTTP requests and responses only.
- **Services:** Contain the core business logic.
- **Dynamic Resolution:** Pricing, availability, and add-ons are resolved dynamically at runtime.
- **Stateless Storage:** No calculated values are stored in the database to ensure data integrity.

## Core Entities

### Category

A high-level grouping for items.

**Examples:**
- Beverages
- Meeting Rooms
- Dining Hall

**Key Fields:**
- `name` (unique)
- `tax_applicable`
- `tax_percentage`
- `is_active`

### Subcategory

An optional grouping under a category.

**Examples:**
- Coffee
- Breakfast Combos

**Key Fields:**
- `category_id`
- `tax` override (optional)
- `is_active`

### Item (Sellable Unit)

Represents a food, beverage, service, or bookable resource.

**Examples:**
- Cappuccino
- Conference Room
- Breakfast Combo

**Key Rules:**
- Belongs to either a category or a subcategory.
- Has exactly one pricing type.
- Can have optional availability and add-ons.

## Pricing Engine

Pricing is resolved at runtime and is never stored in the database.

**Supported Pricing Types:**
- `STATIC`
- `TIERED`
- `COMPLIMENTARY`
- `DISCOUNTED`
- `DYNAMIC` (time-based)

**Required Endpoint:**

`GET /items/:id/price`

**Returns:**
- Applied pricing rule
- Base price
- Tax
- Final payable price

## Tax Inheritance

**Item → Subcategory → Category**

- An item's tax overrides its subcategory's tax.
- A subcategory's tax overrides its category's tax.
- A change in a category's tax automatically reflects everywhere, requiring no manual updates.

## Availability & Booking

Items can define their availability through:

- **Days:** (Mon–Sun)
- **Time slots:** (HH:mm)

This is used for:
- Time-based filtering
- Booking readiness
- Preventing invalid access

## Add-ons System

- Add-ons belong to items.
- Can be optional or mandatory.
- Supports add-on groups with min/max selection.
- Add-on prices are applied dynamically during price calculation.

## Search, Filtering & Pagination

All list APIs support:

- **Pagination:** `page`, `limit`
- **Sorting:** `name`, `price`, `createdAt`
- **Partial text search**
- **Filters:**
  - Price range
  - Category
  - Active only
  - Tax applicable
  - Time-based availability

## Validation

- **Zod** is used for runtime request validation.
- DTOs are inferred from schemas, keeping controllers clean.

## Project Structure

-
---     
src/
├── modules/
│   ├── catalog/
│   ├── pricing/
│   ├── addons/
│   └── booking/
├── shared/
├── infrastructure/
└── server.ts

- **`/src`:** Contains the application source code.
  - **`/controllers`:** HTTP request handlers.
  - **`/services`:** Core business logic.
  - **`/domain`:** Domain entities and engine.
  - **`/database`:** Database models and repositories.
  - **`/utils`:** Utility functions and helpers.
- **`/tests`:** Unit tests.
- **`/docs`:** API documentation.

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up environment variables.
4. Run the application: `npm start`.

## Contributing and Issues

Feel free to fork and submit pull requests. For issues, please use the GitHub issue tracker.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the Node.js and TypeScript communities for their excellent libraries.
- Special thanks to the hiring team for this assignment.

## API Documentation

For detailed API documentation, please see the [API Documentation](./docs/api.md).

## Author

**Mohd Owais Ansari**
Backend Developer (Node.js / TypeScript)
