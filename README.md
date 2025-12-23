# ArchiveIn Project

## Purpose

This project aims to provide a comprehensive and user-friendly system for archiving various academic and practical materials. It features a hierarchical navigation structure, rich content display for detailed items, and a dynamic frontend for an engaging user experience.

## Development Status

This project is currently in active development. Features are being continuously implemented and and refined.

## Technologies Used

- SvelteKit (Frontend Framework)
- Drizzle ORM (Database Toolkit)
- SQLite (Database)
- Tailwind CSS (Styling)
- Lucide Icons (Iconography)

## Setup and Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rotistorage-boop/ArchiveIn.git
    cd ArchiveIn
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Database Setup:**
    - Ensure you have a `.env` file (you can copy `.env.example`).
    - Generate and run database migrations:
      ```bash
      npm run db:generate
      npm run db:migrate
      ```
    - Seed initial data (this will reset your database content):
      ```bash
      npx tsx src/lib/server/db/seed.ts
      ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Open your browser to `http://localhost:5173` (or the port specified in your terminal).

-

## Google Drive Configuration (OAuth2)

This project uses Google Drive as an archival storage service for original high-quality images. It utilizes **OAuth2** with a refresh token to securely access your drive without manual login after setup.

### Steps to Setup

1.  **Create Project & Credentials:**
    - Go to [Google Cloud Console](https://console.cloud.google.com/).
    - Create a new project.
    - Navigate to **APIs & Services > Library**, search for **Google Drive API** and enable it.
    - Navigate to **APIs & Services > OAuth consent screen**.
    - Choose **External**, fill in required app info, and add your email as a **Test User**.
    - Navigate to **APIs & Services > Credentials**.
    - Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
    - Select **Web application**. Add `http://localhost:3000/oauth2callback` to **Authorized redirect URIs**.
    - Copy your **Client ID** and **Client Secret** to your `.env`.

2.  **Generate Refresh Token:**
    - Ensure your `.env` has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
    - Run the token generator script:
      ```bash
      npx tsx src/scripts/get-google-token.ts
      ```
    - Follow the link in your terminal, authorize, and copy the **Code** from the URL bar (the failed redirect page).
    - Paste the code back into the terminal to get your `GOOGLE_REFRESH_TOKEN`.

3.  **Root Folder Setup:**
    - Create a folder in your Google Drive (e.g., `Archive Storage`).
    - Copy the folder ID from the URL (the string after `folders/`).
    - Save this as `GOOGLE_DRIVE_FOLDER_ID` in your `.env`.

### .env Example

```env
# Google Drive (OAuth2)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/oauth2callback"
GOOGLE_REFRESH_TOKEN="1//your-refresh-token"
GOOGLE_DRIVE_FOLDER_ID="your-folder-id"

# ImageKit (CDN)
IMAGEKIT_PUBLIC_KEY="public_..."
IMAGEKIT_PRIVATE_KEY="private_..."
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_id/"
```
