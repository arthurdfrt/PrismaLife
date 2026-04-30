# 💎 PrismaLife: Gamified Life & Task Manager

A modern, web-based task management system built with **Java (Spring Boot)** and **Vanilla JavaScript**, focusing on the "Silo" organization method (Life Areas). This project serves as a practical implementation of **Software Engineering** and **OOP** principles to create a scalable, gamified, and clean architecture.

> [!NOTE]
> **Project Status: Complete (Web Version) 🚀**
> The project has successfully migrated from its initial CLI testing phase to a fully functional Web Application with a RESTful backend and a dynamic frontend. The system now features real-time data synchronization, gamification, and multi-user session handling.

## 🌟 Core Features & Code Mapping

1. **Authentication/Registration:** User registration and login with dynamic session isolation.
    * *Where to find it in the code:* Managed by the `User.java` and `UserController.java` classes in the backend, integrated with `localStorage` in the frontend.
2. **Context Silos (Life Areas):** Customizable separation by areas (e.g., College, Work).
    * *Where to find it in the code:* The data model is defined in `Silo.java`, requests are processed by `SiloController.java`, and each task has its respective association via the `String silo` attribute in the `Task.java` class.
3. **Eisenhower Triage:** Interactive dashboard classification based on Urgency vs. Importance.
    * *Where to find it in the code:* Logic supported by the private boolean attributes `urgent` and `important`, encapsulated in `Task.java`.
4. **Energy Estimation:** Estimated effort level for the task (Low/Medium/High).
    * *Where to find it in the code:* `String energy` attribute in `Task.java`, which acts as an essential trigger for the XP engine in the `claimXp()` method.
5. **Idea Cemetery (Someday):** Dedicated filter for tasks with no defined execution date (Someday/Maybe).
    * *Where to find it in the code:* Controlled by the state of the `boolean someday` attribute in the main `Task.java` class.
6. **Subtasks (Checklist):** Support for micro-management with checklists inside a main task.
    * *Where to find it in the code:* Implemented through Composition, where `Task.java` has a `List<SubTask> subTasks` collection, whose title and completion properties are modeled in `SubTask.java`.
7. **Dependency Chain:** Smart blocking of "high-level" tasks until their base tasks are completed.
    * *Where to find it in the code:* Managed by the `List<Long> dependencies` property in `Task.java`, which stores the IDs of blocking tasks.
8. **Links and Attachments:** Context and reference space for notes and URLs.
    * *Where to find it in the code:* Mapped through the `String link` and `String description` attributes in the `Task.java` model.
9. **XP and Level System:** Gamification and "Anti-Exploit" mechanics with numerical gains per completed life area.
    * *Where to find it in the code:* All logical processing of XP state transactions occurs in the `@PutMapping` mapping inside `TaskController.java`. Calculations update the internal `totalXP` variable in real-time and accumulate points in the `Map<String, Integer> siloXP` data structure.
10. **Attribute Radar:** Dynamic and graphical visualization of the user's progress balance.
    * *Where to find it in the code:* The `GET /api/tasks/stats` endpoint present in `TaskController.java` groups and exports the data from the `siloXP` HashMap for consumption, allowing the radar to be rendered in the frontend.

---

## 🏗️ Applied Object-Oriented Programming (OOP) Concepts

* **Inheritance (Abstract Class and Subclasses):** The project employs structural Inheritance by creating the abstract class `RewardSystem.java`, which defines a contract via the abstract method `calculate()`. The classes `LowEnergyReward.java`, `MediumEnergyReward.java`, and `HighEnergyReward.java` extend this base and implement their own rules and fixed reward values.
* **Polymorphism:** The main architectural highlight lives in the `claimXp()` method of the `Task.java` class. The system uses a conditional block (`switch`) to analyze the task's energy and dynamically instantiate the different reward subclasses, assigning them to a common type variable `RewardSystem`. The actual XP gain is returned through the polymorphic call `reward.calculate()`, delegating the correct decision to Java at runtime.
* **Encapsulation and Composition:** Extensive use of data protection (`private` scopes) and control methods (Getters/Setters) in the models, as well as the aggregation of smaller objects (like `SubTask`) into larger entities (`Task`).

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
- *Ensure the console shows the server is running on `http://localhost:8080`*.

**2. Start the Frontend (UI):**
- Navigate to the folder containing the frontend files (`index.html`, `style.css`, `app.js`).
- Simply double-click any of **`.html`** files, or right-click and open it in your browser (or use IntelliJ's "Open in Browser" feature).