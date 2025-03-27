# Group Discussion Evaluation

This project is designed to evaluate group discussions. It includes both a back-end server and a front-end interface.

## Project Structure

- **database.sqlite**: SQLite database file.
- **package.json** & **package-lock.json**: Node.js project configuration and dependency management.
- **server.js**: Main server file running the back-end.
- **src/**
  - **index.html**: Main HTML file for the front-end.
  - **script.js**: Client-side JavaScript.
  - **style.css**: CSS file for styling.

## Installation

1. Open a terminal in the `group_discussion_eval` folder.
2. Run the command:
   ```bash
   npm install
   ```

## Running the Project Locally

1. Ensure all dependencies are installed.
2. Start the server with:
   ```bash
   node server.js
   ```
3. Open the browser and navigate to the URL provided by the server (commonly `http://localhost:3000` or as output in the terminal).

## Accessing the App Online via ngrok

You can expose your local server to the internet using ngrok:

1. **Install ngrok**:  
   - Download and install ngrok from [ngrok.com](https://ngrok.com/download).

2. **Create a Tunnel**:  
   - In a new terminal, run the command:  
     ```bash
     ngrok http --url=equally-grand-mule.ngrok-free.app 3000
     ```  
   - Replace `3000` with your server's port if different.

3. **Access the Public URL**:  
   - After running ngrok, you will see a public URL (e.g., `https://abc123.ngrok.io`).
   - Use this URL to access your app online.

## Usage

- The front-end is accessible via the `src` folder files and interacts with the back-end server.
- The project evaluates group discussions and stores data in a SQLite database.
