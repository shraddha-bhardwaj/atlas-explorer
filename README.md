# Country Explorer

Display countries around the world. Search by name, filter by continent, and deep dive into country details.

## Tech Stack

**Frontend**

- NextJS : Full stack web framework
- TailwindCSS: Styling CSS Framework
- TanStack Query: Library for caching and state management

**Backend**

- Next.js API Routes: For routing to necesary API endpoints
- MongoDB with Mongoose: MongoDB as NoSQL DB and Mongoose as an ORM.
- Axios: HTTP Client for external APIs.

**Data Sources**

- REST Countries API - External API
- MongoDB - Database for countries and info

## Quick Setup

1. **Get the code**

   ```bash
   git clone git@github.com:naman360/country-explorer.git
   cd country-explorer
   npm install
   ```

2. **Start the database**

   ```bash
   docker-compose up -d
   ```

3. **Configure environment**

   Create `.env.local`:

   ```
   MONGODB_URI=mongodb://localhost:27017/country-explorer
   REST_COUNTRIES_API_URL=https://restcountries.com/v3.1
   USE_API_DATA_SOURCE=false
   ```

4. **Launch the app**
   ```bash
   npm run dev
   npm run populate-db
   ```

Visit `http://localhost:3000` and start exploring! 🌍

## Architecture & Design

### HLD
<img width="4502" height="2447" alt="Untitled-2024-06-27-1547" src="https://github.com/user-attachments/assets/59283f16-97d1-4bd8-b8bf-0d0c49e53675" />




### Clean Architecture Layers

This app is built using a **layered architecture** that keeps code organized and maintainable:

```
Controllers → Services → Repositories → Models
```

**Why this approach?**

- Each layer has one clear responsibility for separating concerns
- Code is more readable and maintainable
- New features can be added easily

### Repository Pattern

Instead of mixing database code with business logic, I separated them:

**Repository Layer** (`src/repositories/`)

- Pure data access - just talks to the database
- No business logic or calculations
- Easy to swap DB

**Service Layer** (`src/services/`)

- Contains all the business logic
- Handles data validation and transformation
- Manages the flow between different data sources

### Singleton Pattern

Both services and repositories use the **singleton pattern** - meaning we create just one instance that gets shared across the whole app. This saves memory and ensures consistent behavior.

```javascript
// One instance for the entire app
const countryServiceObject = new CountryService();
export default countryServiceObject;
```

## Design Decisions

### Hybrid Data Strategy

The app can work with two data sources as per requirement:

1. **REST Countries API**
2. **MongoDB**

You can switch between them using the `USE_API_DATA_SOURCE` environment variable.

## Performance Optimizations

### Backend Optimisations

- **Indexes** - Fast queries on common search patterns
- **Connection Pooling** - Reuse database connections efficiently
- **Pagination** - Handle large data efficiently

### Frontend Optimizations

- **Caching** - TanStack Query optimizes data fetching
- **Debouncing** - Minimises API calls by calling API with some time delay after user has finished writing
- **TailwindCSS** - Does not bloat CSS build, only ships the used classes

## Data Flow

Here's how data moves through the app:

1. **User searches** → Frontend sends request
2. **API Route** receives request → Validates parameters
3. **Service Layer** → Builds search filters and business logic
4. **Repository** → Executes database query
5. **Results return** → Service formats data → API returns response
6. **Frontend updates** → TanStack Query caches and displays results

## Code Quality

### Error handling

- Fallback UI when services are down or returns error
- User-friendly error messages
- Comprehensive logging for debuggings
- Avoiding empty searches
- Validation on search (min limit, max limit and special chars check)

### Maintainability

- Clear separation of concerns
- Consistent code patterns
- Easy to add new features
- Simple to modify existing functionality
- Consistent naming conventions
- Generic error management
