# BixieDesk – AI-Powered Sales & Invoice Management

🚀 **BixieDesk** is an AI-powered business assistant that simplifies sales forecasting, automates invoice processing, and enables seamless database interactions. Ask Bixie anything—no more writing complex SQL queries!

## Features
- ✅ **PredictIT** – AI-driven sales forecasting to help businesses plan ahead.
- ✅ **Ask Bixie** – Natural language database interaction, replacing tedious SQL queries.
- ✅ **Live Analytics** – Real-time sales insights with interactive data visualizations.
- ✅ **Invoice IT** – OCR-based invoice extraction and automated database updates (upcoming).

## Technologies Used

### Frontend
- **React.js** (UI & chatbot interface)

### Backend
- **Node.js / Flask** (API development)
- **MySQL** (Database management)

### Machine Learning & AI
- **Gemini AI** for chatbot interactions
- **NLP** (spaCy, BERT) for processing queries
- **ML model** for sales predictions (in progress)
- **OCR** for invoice extraction (planned)

## Installation & Setup

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Kritika-Jha/BixieDesk.git
cd BixieDesk
'''
###2. Backend Setup
Install Dependencies
Navigate to the backend folder and install the required packages:

```bash
cd backend
npm install   
pip install -r requirements.txt
'''

###3. Set Up MySQL Database
Start MySQL Server:
```bash
mysql -u root -p
Create a new database:
'''
sql
CREATE DATABASE bixiedesk;
Import the schema (if available):

mysql -u root -p bixiedesk < database.sql
Update the database connection details in the backend configuration:

For Node.js (MySQL Connection):

module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "yourpassword",
  DB: "bixiedesk",
  dialect: "mysql",
};

3. Frontend Setup
Install Dependencies
Navigate to the frontend directory and install the required packages:

cd ../frontend
npm install
Start Frontend Server
Start the React development server:

npm start
The app will be available at http://localhost:3000.

How It Works
1️⃣ Ask Bixie – Query your MySQL database in natural language, replacing tedious SQL queries.

2️⃣ PredictIT – Get AI-powered sales predictions based on historical data to help businesses plan ahead.

3️⃣ Live Analytics – View real-time sales trends with interactive visualizations and insights.

4️⃣ Invoice IT – OCR extracts invoice details and automatically updates the database (upcoming feature).

Roadmap & Future Plans
📌 Phase 1: Chatbot integration with MySQL ✅ (Completed)
📌 Phase 2: Train & integrate sales prediction model (In Progress)
📌 Phase 3: OCR-based invoice extraction (Planned)
📌 Phase 4: AI-based invoice generation (Planned)
📌 Phase 5: Scaling & optimization based on user feedback

Security & Privacy
🔒 End-to-End Encryption for database transactions to ensure data protection.
🔐 User Authentication & Access Control for securing data access.
📜 GDPR & Financial Compliance to ensure user data is protected and privacy is respected.
Contributing
We welcome contributions! Here's how you can contribute:

🔹 Fork the repository.
🔹 Create a new branch (feature-name).
🔹 Commit and push your changes.
🔹 Submit a pull request to the main repository.
License
📜 MIT License – Open for contributions!

Contact
For inquiries, reach out to Kritikajha@example.com.
