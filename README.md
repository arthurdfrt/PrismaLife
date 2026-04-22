# 💎 PrismaLife: Gamified Life & Task Manager

A modern, web-based task management system built with **Java (Spring Boot)** and **Vanilla JavaScript**, focusing on the "Silo" organization method (Life Areas). This project serves as a practical implementation of **Software Engineering** and **OOP** principles to create a scalable, gamified, and clean architecture.

> [!NOTE]
> **Project Status: Complete (Web Version) 🚀**
> The project has successfully migrated from its initial CLI testing phase to a fully functional Web Application with a RESTful backend and a dynamic frontend. The system now features real-time data synchronization, gamification, and multi-user session handling.

## 🛠️ Current Features
- **Gamification & XP System:** Earn XP by completing tasks. Level up and visualize your life balance in real-time through a dynamic **Radar Chart** (powered by Chart.js). Anti-exploit mechanisms prevent XP farming.
- **Dynamic Silos (Life Areas):** Create customized categories (Silos) with custom colors to separate your tasks (e.g., College, Work, Health) to avoid cognitive overload.
- **Eisenhower Matrix Integration:** Filter tasks instantly based on **Urgency** and **Importance** to focus on what truly matters.
- **Task Dependencies:** Link tasks together. A task can be "blocked" (🔒) and unclickable until its prerequisite tasks are completed.
- **Specialized Lists & Task Hierarchy:** Support for active execution lists, "Someday/Maybe" idea lists, unlimited SubTasks, rich descriptions, external links, and energy cost estimations.

## 🏗️ Software Engineering & OOP Concepts Applied
* **RESTful Architecture:** Clear separation of concerns between the frontend (UI/DOM Manipulation) and backend (Business logic/Data storage) via standard HTTP methods (GET, POST, PUT, DELETE).
* **Multi-Tenancy:** Implemented custom header-based authentication to isolate data states across different users within the same server instance.
* **Encapsulation & Composition:** Deep utilization of OOP within the Spring Controllers and Model entities. Silo and Task objects are composed and protected by explicit methods.
* **Asynchronous Integration:** Heavy use of the `Fetch API` and `async/await` for seamless, non-blocking data synchronization between client and server.
* **Error Handling & State Management:** Frontend protections against API failures and reactive UI updates based on data mutations.

## 🚀 Getting Started

### Prerequisites
- **JDK 17** or higher.
- An IDE (e.g., **IntelliJ IDEA**, Eclipse, or VS Code).
- A modern web browser.

### How to Run (Development Flow)
This project runs with a decoupled frontend and backend for straightforward testing.

**1. Start the Backend (Java/Spring Boot):**
- Open the project in your IDE (like IntelliJ IDEA).
- Navigate to the main class: `PrismaLifeApplication.java`.
- Click the **Run** (Play) button to execute the application.
- *Ensure the console shows the server is running on `http://localhost:8080`.*

**2. Start the Frontend (UI):**
- Navigate to the folder containing the frontend files (`index.html`, `style.css`, `app.js`).
- Simply double-click the **`index.html`** file, or right-click and open it in your browser (or use IntelliJ's "Open in Browser" feature).

## 📂 Project Structure
- `TaskController`: Central Spring Boot REST Controller handling API endpoints and multi-user data routing via Maps.
- `Task`, `SubTask`, `Silo`: Core Java entities and data models defining the business logic and XP calculation.
- `app.js`: Frontend JavaScript handling state management, API communication, login sessions, and DOM manipulation.
- `index.html` & `style.css`: The visual presentation layer, featuring a responsive dashboard layout, customized themes, and a secure login overlay.
