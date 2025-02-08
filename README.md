
# 🧠 Alzheimer's Disease Risk Assessment System  

## 📌 Overview  
This project is a **full-stack application** designed for assessing Alzheimer's disease risk based on various health and lifestyle factors. It includes:  
- **Frontend:** React.js  
- **Backend:** Node.js with Express  
- **Database:** MySQL  

The system supports multiple user roles (Healthcare Provider, Administrator, Researcher, and Patient) and provides risk assessment, data management, and reporting functionalities.  

## 🚀 Features  

### ✅ **Frontend (React.js)**  
- User-friendly UI for entering patient data, test results, and lifestyle factors  
- Role-based authentication and access control  
- Interactive dashboards and visualizations for risk analysis  
- Search and filter functionalities for easy data retrieval  

### ✅ **Backend (Node.js + Express.js)**  
- RESTful APIs for managing patients, test results, lifestyle data, and assessments  
- JWT-based authentication and role-based access control (RBAC)  
- Secure handling of user data with proper validation and constraints  
- Predefined queries and reports for analysis  

### ✅ **Database (MySQL)**  
- Structured schema following **Entity-Relationship (ER) design**  
- Tables: `Patient`, `Test`, `HealthLifestyleData`, `Assessment`  
- Optimized queries with indexes for better performance  
- Secure storage with proper constraints (e.g., NOT NULL, UNIQUE, FOREIGN KEY)  

---

## 🔧 Installation Guide  

### 🖥 **Prerequisites**  
Make sure you have the following installed:  
- **Node.js** (v14 or later)  
- **MySQL** (v8 or later)  
- **React.js** (Latest version)  

### 📂 **Project Setup**  

#### **1️⃣ Clone the Repository**  
```bash
git clone (https://github.com/Twinkle49/Alzheimer-Risk-Management.git)
cd alzheimers-risk-assessment
```

#### **2️⃣ Backend Setup**  
```bash
cd backend
npm install
```
- **Configure MySQL Database:**  
    ```
     host: "localhost",
  user: "root",
  password: "", 
  database: "risk management"
    ```
  ```
- **Start Backend Server:**  
  ```bash
  npm start
  ```

#### **3️⃣ Frontend Setup**  
```bash
cd frontend
npm install
npm start
```
The React app will start on **http://localhost:3000**.  

---

## 🛠 **Tech Stack**  
**Frontend:** React.js, Redux (if required)  
**Backend:** Node.js, Express.js, JWT Authentication  
**Database:** MySQL, Sequelize ORM  
**Other Tools:** Chart.js (for graphs), bcrypt.js (for password hashing)  

---

## 📌 **Future Enhancements**  
- Implement **AI-based risk prediction models**  
- Add **export reports** feature (CSV/PDF)  
- Enhance **dashboard visualizations**  

---

## 🤝 Contributors  
- **Twinkle Choudhary** (@https://github.com/Twinkle49)  

---

## 📜 License  
This project is licensed under the MIT License.  

---

This README covers everything from setup to API usage. Let me know if you need any modifications! 🚀
