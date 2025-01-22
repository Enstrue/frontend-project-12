# Project "Chat (Slack)"
[![Actions Status](https://github.com/Enstrue/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Enstrue/frontend-project-12/actions)

## About
**"Chat (Slack)"** is a real-time web application. It is a simplified analog of Slack, designed to demonstrate key frontend development skills. The project utilizes modern technologies such as **React (with hooks)**, **Redux (@reduxjs/toolkit)**, **Formik**, **WebSockets**, and **REST API**.

[**Live Demo**](https://frontend-project-12-ehga.onrender.com)

### Key Features
- **Real-Time Communication**: Implemented using WebSockets for instant message delivery.
- **Modern React Development**: Built with React hooks, leveraging functional components for clean and reusable code.
- **State Management**: State handling through `@reduxjs/toolkit` for efficient and scalable architecture.
- **Dynamic Forms**: User-friendly forms with validation and error handling, powered by Formik.
- **Bootstrap-Based UI**: Styled with `react-bootstrap` for responsive and accessible design.
- **Deployment-Ready**: Includes bundling, deployment, and monitoring tools like Rollbar for production use.

---

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16 or later recommended)
- **npm** or **yarn**
- **Make** (for running project commands)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Teihden/frontend-project-12
   cd frontend-project-12
2. Install dependencies:
   ```bash
   make install
   
#### Running the Application

- **Start Frontend**: Launches the React development server:
  ```bash
  make start-frontend

- **Start Backend**: Starts the backend server:
  ```bash
  make start-backend

- **Concurrent Development**: Runs both frontend and backend in watch mode:
  ```bash
  make develop

#### Building for Production
1. Clean the build directory and build the frontend:
   ```bash
   make build
2. Start the production server:
   ```bash
   make start

#### Linting
- Run the linter to check for code style issues:
  ```bash
  make start

### Technologies Used
- **Frontend**: React, Redux (@reduxjs/toolkit), Formik, React-Bootstrap
- **Backend**: WebSocket, REST API
- **Build Tools**: Vite, Makefile
- **Deployment**: Render, Rollbar (for error monitoring)

## Getting Started
The purpose of this project is to replicate real-world frontend development challenges, focusing on:
- Building scalable React applications.
- Integrating WebSockets for real-time data flow.
- Using Redux for state management and Formik for handling complex forms.
- Configuring and deploying production-ready builds.
