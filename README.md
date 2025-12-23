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

## Google Drive Configuration (Free)

This project uses Google Drive as an archival storage service for original high-quality images. It utilizes a **Service Account** to securely access a specific folder in your personal Google Drive. This method is **100% Free** (up to your personal Drive functionality) and widely used for backend storage.

### Steps to Setup

1.  **Create Project & Service Account:**
    - Go to [Google Cloud Console](https://console.cloud.google.com/).
    - Create a new project (e.g., `Archive-Storage`).
    - Navigate to **IAM & Admin > Service Accounts**.
    - Click **+ CREATE SERVICE ACCOUNT**.
    - Name it (e.g., `uploader`), grant it **Editor** role, and finish.

2.  **Enable Google Drive API:**
    - In the console search bar, type "Google Drive API".
    - Select it and click **Enable**.

3.  **Get Credentials (`.env`):**
    - Go back to your Service Account list.
    - Click the email of the service account you created.
    - Go to the **KEYS** tab > **Add Key** > **Create new key** (JSON).
    - A JSON file will download. Open it.
    - Copy the `client_email` value to `GOOGLE_CLIENT_EMAIL` in your `.env`.
    - Copy the `private_key` value (entire string including `-----BEGIN...`) to `GOOGLE_PRIVATE_KEY` in your `.env`.

4.  **Create & Share Folder:**
    - Go to your personal Google Drive.
    - Create a new folder (e.g., `App Uploads`).
    - Open the folder and copy the random string in the URL (e.g., `1aBc...` from `drive.google.com/.../folders/1aBc...`).
    - Paste this string into `GOOGLE_DRIVE_FOLDER_ID` in your `.env`.
    - **CRITICAL:** Click specific folder name > **Share** > Add the **Service Account Email** (from step 3) as an **Editor**.

### .env Example

```env
GOOGLE_CLIENT_EMAIL="uploader@your-project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv... (one long line) ...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID="1aBcDeFgHiJkLmNoPqRsTuVwXyZ"
```

## ImageKit Configuration (Free Tier)

This project uses ImageKit for real-time image optimization and delivery (CDN). It serves the highly optimized WebP versions of your images to the frontend for blazing-fast load times. The **Free Forever** plan is sufficient for personal projects.

### Steps to Setup

1.  **Register Account:**
    - Sign up at [ImageKit.io](https://imagekit.io/).
    - You will be on the free plan by default (20GB Bandwidth/month).

2.  **Get Credentials (`.env`):**
    - On the dashboard, go to **Developer Options** (in the sidebar).
    - Copy the following values into your `.env`:
      - `URL_ENDPOINT` -> `IMAGEKIT_URL_ENDPOINT`
      - `PUBLIC_KEY` -> `IMAGEKIT_PUBLIC_KEY`
      - `PRIVATE_KEY` -> `IMAGEKIT_PRIVATE_KEY`

### .env Example

```env
IMAGEKIT_PUBLIC_KEY="public_..."
IMAGEKIT_PRIVATE_KEY="private_..."
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_id/"
```
