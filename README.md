# Car Rental Management System

This is a comprehensive, modern car rental management system built with a React frontend and an Express.js backend. It provides a complete solution for customers to browse and book cars, and for administrators to manage the entire fleet, monitor bookings, view analytics, and more.

## Features

### For Customers
- **Public Car Listing**: A modern grid view of all available cars.
- **Advanced Filtering**: Filter cars by brand, search by name/model, and select a dynamic price range using a slider.
- **Dynamic Booking Page**: A detailed page to book a specific car, featuring:
  - Date range selection for the rental period.
  - Optional add-ons (e.g., hire driver, full fuel tank).
  - Selectable insurance plans.
  - Real-time price calculation based on selected days and options.
- **Seamless Authentication**: A global modal for Login and Registration that can be triggered from anywhere, ensuring users don't lose their context (e.g., when trying to book).
- **AI-Powered Chatbot**: A floating chat widget powered by a local Ollama LLM to answer user questions about cars and services.

### For Administrators
- **Rich Analytics Dashboard**: A central hub displaying key business metrics:
  - **KPIs**: Total Revenue, Total Bookings, User Count, Fleet Count, and Maintenance Costs.
  - **Charts**: Visualizations for Monthly Revenue and Most Popular Car Models.
- **Full Car Management (CRUD)**: A dedicated section to create, view, update, and delete cars from the fleet.
- **Booking Management**: A complete overview of all bookings made by users, with customer details and rental periods.
- **User Management**: A panel to view all registered users and promote/demote them to an admin role.
- **Advanced Maintenance Module**:
  - A dashboard to monitor the maintenance status of all cars based on kilometers driven.
  - A visual progress bar indicates when a car needs service.
  - Ability to log maintenance actions (e.g., oil change), which automatically resets the car's maintenance clock and status.
- **Dynamic Simulation**: A background job realistically simulates kilometer accumulation for all reserved cars, making the maintenance data dynamic.

---

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- **Node.js**: (v18.x or later recommended). You can download it from [nodejs.org](https://nodejs.org/).
- **MongoDB**: A local or cloud-hosted MongoDB instance. For local development, you can use [MongoDB Community Server](https://www.mongodb.com/try/download/community).
- **Ollama**: To run the AI chatbot locally. Download and install it from [ollama.ai](https://ollama.ai/).
  - After installing Ollama, you must pull a model. We recommend a small, fast model for this feature:
    ```sh
    ollama pull llama3.2
    ```

---

## Setup & Running the Project

The project is split into two main folders: `car-rental-backend-express` (the API) and `car-rental-frontend` (the web app). You need to run both simultaneously.

### 1. Backend Setup (`car-rental-backend-express`)

1.  **Navigate to the backend directory:**
    ```sh
    cd car-rental-backend-express
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Create an environment file:**
    Create a file named `.env` in this directory.

4.  **Start the backend server:**
    ```sh
    node index.js
    ```
    The API server should now be running, typically on port 5000.

### 2. Frontend Setup (`car-rental-frontend`)

1.  **In a new terminal**, navigate to the frontend directory:
    ```sh
    cd car-rental-frontend
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Create an environment file:**
    Create a file named `.env` in this directory.
4.  **Start the frontend development server:**
    ```sh
    npm run dev
    ```
    The React application should now be running and accessible in your browser, typically at `http://localhost:5173`.

---

## Environment Variables (`.env`)

The backend requires an `.env` file in the `car-rental-backend-express` directory with the following keys:

```
# The connection string for your MongoDB database

MONGODB_URI=mongodb://localhost:27017/carRentalDB

# A secret key used to sign JSON Web Tokens (JWT) for authentication
# You can generate a strong secret using an online generator

JWT_SECRET=your_super_secret_jwt_key

# The port number for the backend server
PORT=5000
```

---

The frontend requires an `.env` file in the car-rental-frontend with the following keys: 

VITE_API_URL=http://localhost:5000

## Customizing the AI Model

The AI chatbot is configured to use a specific model from your local Ollama instance. You can easily change this.

1.  **Open the chatbot controller file**:
    `car-rental-backend-express/controllers/chatbot.controller.js`

2.  **Modify the `model` property**:
    Change the value of the `model` property in the `axios.post` call to any other model you have downloaded with Ollama.

    ```javascript
    // ... inside the handleChat function

    const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
      // highlight-next-line
      model: "llama3.2", // CHANGE THIS to "llama3", "mistral", etc.
      prompt: `You are a helpful car rental assistant. The user is asking: "${prompt}". Keep your answer concise and helpful.`,
      stream: false
    });

    // ...
    ```

---

## Known Issues

1.  **Freeze after editing cars**: When editing a car, the inputs cause the front to rerender infinitly in a loop causing the frontend to crash and freeze to avoid this refresh the page after editing a car