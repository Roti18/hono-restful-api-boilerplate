# Hono Security API Boilerplate

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg)

**The Ultimate Foundation for Modern APIs.** 
A strict, security-first, and high-performance REST API boilerplate built with **Hono**, **TypeScript**, and **Turso (libSQL)**. Designed for speed, scalability, and developer experience.

---

##  Features

-   **High Performance**: Built on Hono (Edge-ready) and bun/node compatible.
-   **Security Hardened**: Secure headers, Zod validation, Rate Limiting, and CORS enabled.
-   **Authentication**: Hybrid system supporting **API Keys** (SHA-256 hashed) and **OAuth 2.0** (Bearer Tokens).
-   **Database Integration**: Pre-configured with **Turso (libSQL)**. Supports local SQLite for dev.
-   **Developer Tools**: Built-in **CLI Manager** and **Web DB Viewer**.
-   **Documentation**: Auto-generated clean API docs and landing page.

---

##  Quick Start

### 1. Installation
```bash
git clone <your-repo-url>
cd hono-secure-api
npm install
```

### 2. Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
_By default, it uses `file:local.db` for zero-setup local development._

### 3. Initialize Database
Create necessary tables and seed initial data:
```bash
npm run db:push    # Create tables
npm run db:seed    # Insert test data
```

### 4. Run Development Server
```bash
npm run dev
```
-   **API**: `http://localhost:3000`
-   **DB Viewer**: `http://localhost:3000/admin/db`
-   **Docs**: `http://localhost:3000/docs/index.html`

---

## CLI Manager (`db:do`)

A powerful built-in CLI tool to manage your database directly from the terminal.

| Command | Description |
| :--- | :--- |
| `npm run db:do` | Main CLI entry point (help menu) |
| `npm run db:table:view <name>` | View table rows (clean format) |
| `npm run db:table:drop <name>` | Delete a table permanently |
| `npm run db:table:clear <name>` | Delete ALL rows in a table |
| `npm run db:row:insert <name> ...` | Insert a new row (key=value) |
| `npm run db:row:update <name> <id> ...` | Update a row by ID |
| `npm run db:row:delete <name> <id>` | Delete a row by ID |
| `npm run db:sql "<query>"` | Run raw SQL queries |

**Example Usage:**
```bash
# View items
npm run db:table:view items

# Insert a user
npm run db:row:insert users email="test@api.com" role="admin"

# Delete a record
npm run db:row:delete items 81404df4-a158-4e94-b7ef-b8f51a7839a4
```

---

## Database Viewer (Web)

For a visual experience, verify your data using the built-in web viewer.
-   Access at: `http://localhost:3000/admin/db`
-   **Features**: Dark/Light mode, searchable tables, clean UI.
-   *Note: Only available in `development` mode by default.*

---

## Project Structure

```
src/
├── app.ts                 # App entry (Middleware, Route mounting)
├── server.ts              # Server entry (Runtime setup)
├── config/                # Environment & Service configs
├── controllers/           # Request Handlers (Functional)
├── middlewares/           # Auth, Logging, Error handling
├── models/                # Data Access Layer (SQL)
├── routes/                # Route Definitions
├── scripts/               # CLI & Migration Scripts
├── services/              # Business Logic
├── types/                 # TS Definitions (Zod inferred)
└── utils/                 # Helpers (UUID, Response)
```

---

## Security Architecture

1.  **API Keys**: Stored as constant-time comparable SHA-256 hashes.
2.  **Stateless Tokens**: JWT-based access tokens with rotation matching OAuth 2.0 standards.
3.  **Input Validation**: Strict Zod schemas for every endpoint.
4.  **Headers**: Hono `secure-headers` middleware enabled globablly.

---

## Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Compile TypeScript for production |
| `npm run start` | Run production build |
| `npm run lint` | Check types and errors |
| `npm run format` | Format code with Prettier |
| `npm run clean` | Remove `dist` folder |

---

## License
MIT License. Built by [**Roti18**](https://github.com/Roti18).
