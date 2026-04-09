# 📝 Life Manager

A robust task management system built with **Java**, focusing on the "Silo" organization method (Life Areas). This project serves as a practical implementation of **Object-Oriented Programming (OOP)** principles to create a scalable and clean architecture.

> [!NOTE]
> **Project Status: Backend Validation Phase**
> The current CLI (Command Line Interface) is a **temporary testing tool** used to validate the business logic, class relationships, and data flow. The system architecture is being developed with a clear separation of concerns, preparing it for future integration with a **Web Frontend** or **Mobile Interface**.

## 🛠️ Current Features
- **User Management:** Mock login and user retrieval via `UserRegistry`.
- **Life Area Silos:** Organize tasks into up to 6 distinct areas (e.g., Work, College, Personal) to avoid cognitive overload.
- **Task Hierarchy:** Support for Tasks and SubTasks.
- **Specialized Lists:** Uses Inheritance to differentiate between active execution lists (`TaskList`) and "Someday/Maybe" idea lists (`SomeDay`).
- **Interactive CLI:** A nested menu system using `Scanner` for real-time terminal interaction.

## 🏗️ OOP Concepts Applied
* **Encapsulation:** All attributes are `private`, protected by explicit Getters and Setters.
* **Inheritance:** The `SomeDay` class extends `TaskList`, inheriting base behaviors while allowing for specialized overrides.
* **Composition:** `LifeArea` objects are composed of multiple task lists, demonstrating "Has-A" relationships.
* **Polymorphism:** Method overriding used to provide specific behaviors for different list types.
* **Constructor Overloading:** Multiple ways to initialize tasks and users for better flexibility.

## 🚀 Getting Started

### Prerequisites
- **JDK 17** or higher.
- A terminal (WSL, Linux, or PowerShell).

### How to Run
1. Clone the repository and navigate to the root folder.
2. Compile all files:
   ```bash
   javac *.java
   ```
3. Run the main application:
   ```bash
   java Main
   ```

## 📂 Project Structure
- `User` & `UserRegistry`: Handles profile data and access logic.
- `LifeArea`: The "Silo" container that holds task and idea lists.
- `TaskList` & `SomeDay`: Data structures for storing tasks.
- `Task` & `SubTask`: Core units of work.