# Dashboard Project

This project contains a dashboard system with three main flows:
1.  **User Flow**
2.  **Seller Flow** (with 3D Studio)
3.  **Tailor Flow**

## How to Run Locally

To run this project properly, especially the **3D Studio** which requires a server to load models, follow these steps:

### Option 1: Using the provided script (Recommended)
1.  Look for the file named `run_server.bat` in this folder.
2.  **Double-click** `run_server.bat`.
3.  A black window will open. **Do not close it**.
4.  Open your web browser and go to: `http://localhost:8000`
5.  You will see the Login Selection screen. Proceed from there.

### Option 2: Using VS Code Live Server
1.  Open this folder in VS Code.
2.  Install the "Live Server" extension.
3.  Right-click `index.html` and select "Open with Live Server".

## Folder Structure
-   `index.html`: Main entry point (Login Selection).
-   `Seller-flow/`: Login and verification for Sellers.
-   `Sellerdashborad/`: Main Seller Dashboard files (including 3D Studio).
-   `Tailor-flow/`: Login and verification for Tailors.
-   `user-flow/`: Login for regular users.
