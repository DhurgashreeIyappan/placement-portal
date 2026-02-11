# Placement Management Platform (MERN)

Full-stack placement management system with **Coordinator** and **Student** roles, company drives, registrations, interview rounds, placements, groups, announcements, calendar, and interview experience sharing.

## Tech Stack

- **Frontend:** React (Vite, JavaScript), React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** JWT, role-based access (Coordinator / Student)

## Project Structure

```
Placement-portal/
├── backend/
│   ├── config/
│   │   ├── env.js                # Load & validate env (dotenv)
│   │   └── db.js                 # MongoDB connection (single place)
│   ├── app.js                    # Express app (routes, middleware)
│   ├── server.js                 # Entry: env → connectDB → listen
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── companyController.js
│   │   ├── registrationController.js
│   │   ├── groupController.js
│   │   ├── announcementController.js
│   │   ├── calendarController.js
│   │   ├── interviewRoundController.js
│   │   ├── placementController.js
│   │   ├── experienceController.js
│   │   ├── analyticsController.js
│   │   └── studentController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT protect + optionalProtect
│   │   ├── roleCheck.js           # coordinatorOnly, studentOnly
│   │   ├── errorHandler.js
│   │   └── validate.js            # express-validator
│   ├── models/
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── Registration.js
│   │   ├── InterviewRound.js
│   │   ├── Placement.js
│   │   ├── Group.js
│   │   ├── Announcement.js
│   │   ├── Experience.js
│   │   └── CalendarEvent.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── groupRoutes.js
│   │   ├── announcementRoutes.js
│   │   ├── calendarRoutes.js
│   │   ├── interviewRoundRoutes.js
│   │   ├── placementRoutes.js
│   │   ├── experienceRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── studentRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/                  # Axios instance + API modules
│   │   ├── components/            # Layout, ProtectedRoute
│   │   ├── context/               # AuthContext
│   │   ├── pages/
│   │   │   ├── Login.jsx, Register.jsx
│   │   │   ├── coordinator/      # Dashboard, Companies, Groups, Calendar, Analytics, etc.
│   │   │   ├── student/          # Dashboard, Drives, Progress, Placement History, Announcements
│   │   │   └── experiences/      # Browse, Detail, Submit
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Database Schema Design (MongoDB Atlas + Mongoose)

- **User:** name, email, password (hashed), role (`coordinator` | `student`). Students: rollNo, batch, branch, cgpa, tenthPercent, twelfthPercent, backlogCount, isPlaced. Data is preserved across academic years.
- **Company:** name, description, academicYear, eligibility (minCgpa, maxBacklog, minTenthPercent, minTwelfthPercent, allowedBranches[], batchYears[]), registrationDeadline, isPublished, createdBy. One drive per company per academic year (conceptual).
- **Registration:** company, student, status (registered/shortlisted/rejected/withdrawn). Unique (company, student) to prevent duplicate registrations.
- **InterviewRound:** company, roundName, roundIndex, date, results[] (student, roundIndex, status, remarks), createdBy. Tracks round-wise progression per student.
- **Placement:** student, company, ctc, role, academicYear, placedAt, createdBy. Unique (student, academicYear) for historical placement records.
- **Group:** name, type (company | batch), company (ref), batchYear, members[] (User refs), createdBy.
- **Announcement:** group, title, content, createdBy.
- **CalendarEvent:** company, title, description, eventDate, endDate, type (pre_placement_talk, aptitude, technical, hr, result, other), createdBy.
- **Experience:** company (optional), companyName, yearOfVisit, academicYear, author, roundDetails[] (roundName, experience, questions[], tips), preparationTips, status (pending/approved/rejected), moderatedBy, moderatedAt. Only placed students can submit; listing is filtered by status (e.g. approved).

Historical data is preserved: academic year and batch fields allow filtering and reporting across years.

## Setup

### 1. MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), create an account (or sign in).
2. Create a new cluster (free tier is enough).
3. Under **Database Access**, add a database user (note username and password).
4. Under **Network Access**, add IP (e.g. `0.0.0.0/0` for development, or your IP).
5. In the cluster, click **Connect** → **Connect your application** → copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority`
6. Replace `<username>`, `<password>`, and optionally `<dbname>` (e.g. `placement_portal`).



### 2. Environment variables (backend)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

- **MONGODB_URI** (required) – your Atlas connection string with username, password, and DB name.
- **JWT_SECRET** (required) – long random string (e.g. `openssl rand -hex 32`).
- **PORT** (optional) – default `5000`.
- **FRONTEND_URL** (optional) – default `http://localhost:5173` for CORS.

The server validates required variables at startup and exits with a clear message if any are missing.

### 3. Run backend

```bash
cd backend
npm install
npm run dev
```

Server runs at `http://localhost:5000`. Health: `GET http://localhost:5000/api/health`.

### 4. Run frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`. Vite proxy forwards `/api` to `http://localhost:5000`, so no `VITE_API_URL` is needed in development.

### 5. First use

- Open `http://localhost:5173`, click **Register**.
- Create one **Coordinator** and one **Student** (with batch, branch, CGPA, etc. for eligibility).
- Login as Coordinator: create a company drive, set eligibility, publish it; create groups; add calendar events; post announcements; add interview rounds and mark placements.
- Login as Student: view drives, check eligibility, register; see progress, placement history, announcements; browse and (if placed) submit interview experiences.

## API Overview (REST)

- **POST /api/auth/register**, **POST /api/auth/login**, **GET /api/auth/me**
- **GET /api/companies/published** (public), **GET/POST/PUT/DELETE /api/companies** (coordinator)
- **POST /api/registrations** (student register), **GET /api/registrations/my**, **GET /api/registrations/check-eligibility/:companyId**, **GET /api/registrations/company/:companyId** (coordinator), **PATCH /api/registrations/:id**
- **GET/POST/PUT/DELETE /api/groups**, **POST /api/groups/:id/members**, **DELETE /api/groups/:id/members/:memberId**
- **POST /api/announcements**, **GET /api/announcements/group/:groupId**, **GET /api/announcements/my** (student)
- **GET/POST/PUT/DELETE /api/calendar**
- **GET/POST /api/interview-rounds**, **GET /api/interview-rounds/company/:companyId**, **PATCH /api/interview-rounds/:id/result**, **PATCH /api/interview-rounds/:id/results-bulk**, **DELETE /api/interview-rounds/:id**
- **GET/POST /api/placements**
- **GET /api/experiences**, **GET /api/experiences/:id** (optional auth), **GET /api/experiences/my/list**, **POST /api/experiences**, **PATCH /api/experiences/:id/moderate**
- **GET /api/analytics/dashboard**, **GET /api/analytics/company/:companyId**, **GET /api/analytics/placed-students**, **GET /api/analytics/my-placement-history**
- **GET /api/student/companies**, **GET /api/student/interview-progress**

All coordinator/student-specific routes use JWT and role middleware as described in the requirements.
