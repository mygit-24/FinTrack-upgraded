
Personal Finance Tracker


Technologies

Frontend: React, React Router, React-i18next, Recharts, Framer Motion, Lucide-react, Axios  (Location: finance-client/src – pages & components)

Backend: Node.js, Express (JWT Auth), Mongoose, Service & Repository layers  (Location: finance-server/src/controllers, src/services, src/repositories)

Database: MongoDB

Validation: Yup  (Location: finance-client/src/components/auth/LoginForm.jsx, RegisterForm.jsx)

Other Tools: Axios, XLSX, file-saver  (Location: finance-client/src/components/transaction/transactionsTable.jsx)


Features

User registration and login  (Location: finance-client/src/components/auth/LoginForm.jsx, RegisterForm.jsx; finance-server/src/controllers/auth.controller.js, src/services/auth.service.js)

User profile management with first and last name (including optional password change)  (Location: finance-client – profile form component; finance-server/src/controllers/user.controller.js, src/services/users.service.js)

Transaction management: add, edit, delete, filter and export to Excel  (Location: finance-client/src/components/transaction/transactionsTable.jsx; finance-server/src/controllers/transactions.controller.js, src/services/transactions.service.js, src/repositories/transactions.repository.js)

Goals and savings management with progress bar and pagination (10 rows per page)  (Location: finance-client/src/components/goals/GoalsSection.jsx, DesktopTable.jsx, GoalProgressBar, DesktopTable.scss)

Summaries and KPI display on home page  (Location: finance-client/src/pages/HomePage/HomePage.jsx, components/common/KpiCard/KpiCard.jsx)

Charts and dashboard for expense and income categories  (Location: finance-client/src/pages/HomePage/HomePage.jsx – Recharts)

Security with JWT (token stored in HTTP-only cookie)  (Location: finance-server/src/controllers/auth.controller.js, src/services/auth.service.js)

Multi-language UI: Hebrew/English with language switcher before and after login  (Location: finance-client/src/i18n setup, src/locales/*/translation.json, components/LanguageSwitcher.jsx, components/layout/Layout.jsx, pages/HomePage/HomePage.jsx)

Improved empty-state messages when there are no goals / no transactions  (Location: finance-client/src/components/goals/GoalsSection.jsx, DesktopTable.jsx; components/transaction/transactionsTable.jsx – i18n keys goals.section.* , transactions.table.*)

Backend refactor to Service/Repository pattern for users, auth and transactions  (Location: finance-server/src/services/*.service.js, src/repositories/*.repository.js; controllers updated to use these services)


Installation

1. Clone the repository:
https://github.com/ruti0364/Financial-Management.git

2. cd finance-client

3. Install dependencies:
npm install

4. npm start

5. cd finance-server

6. Install dependencies:
npm install

7. create .env file in the server  
write this with the following variables:  
MONGO_URI=your-mongodb-connection-string  (Location: finance-server/.env – used in DB connection)  
JWT_SECRET=your-jwt-secret  (Location: finance-server/src/services/auth.service.js – JWT creation/verification)  
PORT=5000  (Location: finance-server/index.js or app.js – server listen port)

8. npm start
