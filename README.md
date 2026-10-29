# EduVault — Static GitHub Pages Version

This package is a static-only version of EduVault for GitHub Pages. It does not require Python, Flask, a virtual environment, or a database.

## Files
- `index.html` — landing page with split layout, sign-in/sign-up UI and parallax effects.
- `landing.css` and `landing.js` — landing page styling and interactions.
- `dashboard.html` — existing dashboard UI preview.
- `STYLE.CSS` and `SCRIPTS.JS` — dashboard styling and browser-side interactions.

## Publish on GitHub Pages
1. Create a new GitHub repository.
2. Extract this ZIP and upload the **contents** of this folder to the repository root (so `index.html` is at the root, not inside another folder).
3. Commit the files to the `main` branch.
4. Open **Settings → Pages**. Under Build and deployment, select **Deploy from a branch**, choose `main` and `/(root)`, then Save.
5. Wait for GitHub Pages to publish the site. The public URL will appear on the Pages settings screen.

## Important limitations
- Login, account registration and password recovery are UI demonstrations only. No credentials are sent or stored.
- Dashboard interactions are browser-side preview behavior only. There is no Flask backend, database, server-side authentication, file upload, or secure private storage.
- This is a static site; do not put secrets, passwords, API keys or private data in these files.
