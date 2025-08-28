# CSVUp Client

A minimal React + TypeScript frontend for uploading CSV files to the CSVUp backend API.

---

## What This Project Does

- **Uploads CSV files** to a backend at `http://localhost:8000/api/v1/uploads/csv/`
- Provides a simple, styled UI for file selection and upload status

---

## Major Files Explained

- [`src/FileUploader.tsx`](src/FileUploader.tsx):  
  The core component. Handles file selection and upload logic.  
  - Uses `loglevel` for debug/error logging.
  - Sends the selected CSV file to the backend and displays the result.

- [`src/App.tsx`](src/App.tsx):  
  The main app shell.  
  - Imports and renders `FileUploader` centered on the page.
  - Sets up the basic layout and styling.

---

## Quickstart

1. **Clone the repo**
    ```sh
    git clone https://github.com/entuziaz/csvup-client
    cd csvup-client
    ```

2. **Install dependencies**
    ```sh
    npm install
    ```

3. **Start the development server**
    ```sh
    npm run dev
    ```
    - Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Upload a CSV**
    - Click "Upload CSV", select a `.csv` file, and hit "Upload".
    - You’ll see the upload result or any error message.

---

## Contributing

- All logic is in [`src/FileUploader.tsx`](src/FileUploader.tsx) and [`src/App.tsx`](src/App.tsx).
- Use `loglevel` for logging (`log.info`, `log.error`, etc).
- Lint your code with:
    ```sh
    npm run lint
    ```
- Styling uses Tailwind-like utility classes (but no Tailwind dependency).

---

## Troubleshooting

- **Backend not running?**  
  The upload will fail if `http://localhost:8000` isn’t available.
- **File not uploading?**  
  Check the browser console and logs for errors.

---

## Need Help?

- Ask teammates for API details if the backend changes.