# KAM OS - Functional Specification

## Overview

KAM OS (Key Account Management Operating System) is a B2B relationship execution system designed to transform how companies manage their strategic accounts. Unlike traditional CRMs, KAM OS is oriented toward strategic execution with the dominant flow: Meeting -> AI Analysis -> Diagnostic -> Strategy -> Plan -> Actions -> Execution -> Result.

## Core Principles

The system operates on three fundamental principles:

1. **CRM is consequence, not starting point** - Data entry happens as a natural result of the execution flow, not as a separate administrative task.

2. **KAM Plan is the nucleus** - Every feature and screen ultimately connects to and supports the KAM Plan, which is the operational heart of the system.

3. **AI is copilot, not feature** - Artificial intelligence is integrated throughout the workflow to assist decision-making, not as a standalone capability.

---

## Screen Specifications

### 1. Login

**Objective:** Authenticate users into the system.

**User Profile:** All users (KAM, Admin, Manager).

**Fields Displayed:**
- Email (text input)
- Password (password input)

**Fields Editable:** All fields.

**Actions:**
- Login button - Authenticates user and redirects to Dashboard
- "Forgot Password" link - Navigates to password recovery
- "Register" link - Navigates to registration

**Empty States:** N/A

**Possible Errors:**
- Invalid credentials
- Account disabled
- Network error

**Step-by-step Flow:**
1. User enters email
2. User enters password
3. User clicks Login
4. System validates credentials
5. On success: Store tokens (access + refresh) and redirect to Dashboard
6. On failure: Display error message

**Related Screens:** Register, Forgot Password, Dashboard

**Backend Entities:** users, organizations

**Endpoints Used:**
- POST /api/v1/auth/login

**Business Rules:**
- Access token expires in 30 minutes
- Refresh token expires in 7 days
- Automatic token refresh on 401 responses

---

### 2. Register

**Objective:** Create new user accounts and organizations.

**User Profile:** New users.

**Fields Displayed:**
- Full Name (text input)
- Email (text input)
- Password (password input)
- Organization Slug (text input)

**Fields Editable:** All fields.

**Actions:**
- Register button - Creates account and auto-logs in
- "Already have account" link - Navigates to Login

**Empty States:** N/A

**Possible Errors:**
- Email already registered
- Invalid email format
- Password too short (min 8 characters)
- Organization inactive

**Step-by-step Flow:**
1. User fills all fields
2. User clicks Register
3. System creates organization if slug doesn't exist (user becomes admin)
4. System creates user account
5. System auto-logs in user
6. Redirect to Dashboard

**Related Screens:** Login, Dashboard

**Backend Entities:** users, organizations

**Endpoints Used:**
- POST /api/v1/auth/register

**Business Rules:**
- First user of a new organization becomes admin
- Subsequent users joining existing org become KAM role

---

### 3. Dashboard

**Objective:** Provide overview of key metrics and quick access to important data.

**User Profile:** All authenticated users.

**Fields Displayed:**
- Total accounts count
- Active opportunities count
- Pending activities count
- Recent activities list
- Account health summary
- Pipeline overview

**Fields Editable:** None (read-only dashboard).

**Actions:**
- Click on metric cards - Navigate to detailed views
- Quick action buttons - Create new account, meeting, opportunity

**Empty States:**
- "No accounts yet" with CTA to create first account
- "No activities" with CTA to schedule activity

**Possible Errors:**
- Failed to load dashboard data

**Step-by-step Flow:**
1. User lands on dashboard after login
2. System loads all dashboard metrics in parallel
3. User views overview
4. User clicks on area of interest to drill down

**Related Screens:** Accounts, Opportunities, Activities, Reports

**Backend Entities:** accounts, opportunities, activities, contacts

**Endpoints Used:**
- GET /api/v1/dashboard/summary
- GET /api/v1/dashboard/metrics

---

### 4. Accounts List

**Objective:** View and manage all customer accounts.

**User Profile:** All authenticated users.

**Fields Displayed:**
- Account name
- Industry/Segment
- KAM Stage (Discovery, Development, Expansion, Retention)
- ABC Category
- Prioritization Score
- Health Status
- Assigned KAM

**Fields Editable:** None in list view.

**Actions:**
- Create new account button
- Click row - Navigate to Account Detail
- Search/filter accounts
- Sort by columns

**Empty States:**
- "No accounts yet. Create your first account to get started."

**Possible Errors:**
- Failed to load accounts

**Step-by-step Flow:**
1. User navigates to Accounts
2. System loads paginated account list
3. User can search/filter
4. User clicks account to view details

**Related Screens:** Account Detail, Dashboard

**Backend Entities:** accounts, categories, users

**Endpoints Used:**
- GET /api/v1/accounts

---

### 5. Account Detail

**Objective:** View and manage all information about a specific account.

**User Profile:** All authenticated users.

**Fields Displayed (Information Tab):**
- Name, CNPJ, Website
- Segment, Region, City, State
- Estimated Revenue, Employee Count
- Category, Status, Strategic flag
- Notes, KAM Stage

**Fields Editable:** All fields in edit mode.

**Actions:**
- Edit button - Enable edit mode
- Save button - Persist changes
- Cancel button - Discard changes
- Navigate tabs (Information, Contacts, Opportunities, Activities, KAM Plan, Value Matrix, Meetings)

**Empty States:** Per tab - appropriate empty state with CTA

**Possible Errors:**
- Failed to save account
- Validation errors

**Step-by-step Flow:**
1. User clicks Edit
2. Fields become editable
3. User modifies fields
4. User clicks Save
5. System sends all fields to backend
6. System reloads data to confirm persistence
7. Edit mode closes

**Related Screens:** Accounts List, Contacts, Opportunities, KAM Plan

**Backend Entities:** accounts, contacts, opportunities, activities, kam_plans

**Endpoints Used:**
- GET /api/v1/accounts/{id}
- PUT /api/v1/accounts/{id}

**Business Rules:**
- All fields are optional except name
- Changes persist immediately on save

---

### 6. KAM Plan (Plano KAM)

**Objective:** Central operational hub for strategic account execution.

**User Profile:** KAM users, Managers, Admins.

**Tabs/Sections:**

#### 6.1 Diagnostic & Context (Diagnostico e Contexto)
**Fields:** Company context, market position, strategic objectives, challenges, opportunities
**Actions:** Edit, Save
**Backend:** GET/PUT /api/v1/kam-plans/{account_id}/diagnostic

#### 6.2 Stakeholder Map (Mapa de Stakeholders)
**Fields:** Stakeholder list with name, role, influence level, support level, relationship status
**Actions:** Add stakeholder, Edit, Delete, View organogram
**Backend:** GET/POST/PUT/DELETE /api/v1/kam-plans/{account_id}/stakeholders

#### 6.3 Wallet Share
**Fields:** Business lines with annual potential, current revenue, participation %, gap, priority
**Actions:** Add line, Edit, Delete
**Backend:** GET/POST/PUT/DELETE /api/v1/kam-plans/{account_id}/wallet-share

#### 6.4 Action Plan (Plano de Acao KAM)
**Fields:** Actions with objective, type, stakeholder, responsible, dates, status, result
**Actions:** Add action, Edit, Delete, Update status
**Backend:** GET/POST/PUT/DELETE /api/v1/kam-plans/{account_id}/actions

#### 6.5 Risks & Competition (Riscos e Concorrencia)
**Fields:** Risks with description, probability, impact, mitigation; Competitors with name, strengths, weaknesses, strategy
**Actions:** Add risk/competitor, Edit, Delete
**Backend:** GET/POST/PUT/DELETE /api/v1/kam-plans/{account_id}/risks, /competitors

#### 6.6 KAM Anatomy (Anatomia KAM)
**Fields:** Strategic pillars with maturity assessment, tactical/strategic descriptions, analysis
**Actions:** Edit pillar details, Update maturity level
**Backend:** GET/PUT /api/v1/kam-plans/{account_id}/pillars

**Empty States:** Each section shows appropriate empty state with CTA to add first item.

**Business Rules:**
- All sections persist to backend immediately on save
- Loading states shown during API calls
- Error alerts on save failures

---

### 7. Value Matrix (Matriz de Valor)

**Objective:** Map value attributes and their perception by stakeholders.

**User Profile:** KAM users, Managers.

**Fields Displayed:**
- Value attributes (name, description, importance)
- Stakeholder perception scores
- Gap analysis

**Fields Editable:** All in edit mode.

**Actions:**
- Add value attribute
- Edit attribute
- Delete attribute
- Map stakeholder perceptions

**Empty States:**
- "No value attributes defined. Add your first attribute to start mapping value."

**Backend Entities:** value_attributes, stakeholder_perceptions

**Endpoints Used:**
- GET /api/v1/value-matrix/{account_id}/attributes
- POST /api/v1/value-matrix/{account_id}/attributes
- DELETE /api/v1/value-matrix/{account_id}/attributes/{id}

---

### 8. Meetings

**Objective:** Record meetings and generate AI-powered insights.

**User Profile:** All authenticated users.

**Fields Displayed:**
- Meeting title
- Account
- Date/time
- Participants
- Transcription/Notes
- AI Analysis indicator

**Fields Editable:** All fields when creating.

**Actions:**
- Create new meeting
- View meeting details
- Generate AI insights
- View AI analysis (summary, pain points, solutions, next steps, email suggestion)

**Empty States:**
- "No meetings recorded. Register your first meeting to get AI-powered insights."

**Step-by-step Flow:**
1. User clicks "New Meeting"
2. User selects account, enters title, date, participants
3. User enters meeting notes/transcription
4. User saves meeting
5. System triggers AI analysis (async)
6. User can view AI insights when ready

**Backend Entities:** meetings, ai_insights

**Endpoints Used:**
- GET /api/v1/meetings
- POST /api/v1/meetings
- GET /api/v1/meetings/{id}/insights

**Business Rules:**
- AI analysis requires OPENAI_API_KEY configured
- Fallback mock analysis when AI not available

---

### 9. Reports

**Objective:** Analyze performance metrics and export data.

**User Profile:** Managers, Admins.

**Tabs:**
- Pipeline - Opportunity stages and values
- Forecast - Projected vs actual revenue
- Activities - KAM activity metrics
- Account Health - Health scores and risk indicators
- Value - Stakeholder value mapping
- KAM Plan - Plan execution metrics

**Filters:**
- Date range (week, month, quarter, year)
- KAM user
- Segment
- Category

**Actions:**
- Apply filters
- Export to Excel (.xlsx)
- Save view configuration

**Export Features:**
- Professional formatting
- Auto-adjusted columns
- Formatted headers
- Multiple sheets (one per report type)

**Backend Entities:** All entities aggregated

**Endpoints Used:**
- GET /api/v1/reports/pipeline
- GET /api/v1/reports/forecast
- GET /api/v1/reports/activities
- GET /api/v1/reports/account-health
- GET /api/v1/reports/value-stakeholder
- GET /api/v1/reports/kam-plan

---

### 10. Profile

**Objective:** Manage user profile information.

**User Profile:** All authenticated users.

**Fields Displayed:**
- Full name (editable)
- Email (read-only)
- User ID
- Account status
- Member since date

**Actions:**
- Edit name
- Save changes

**Backend Entities:** users

**Endpoints Used:**
- PUT /api/v1/admin/users/{id}

---

### 11. Settings

**Objective:** Configure application preferences.

**User Profile:** All authenticated users.

**Settings Available:**
- Email notifications toggle
- Push notifications toggle
- Dark mode toggle (UI only, not implemented)

**Actions:**
- Toggle settings
- Save to localStorage

**Business Rules:**
- Settings persist in localStorage
- Dark mode toggle is placeholder for future implementation

---

### 12. Admin

**Objective:** System administration for organization.

**User Profile:** Admin users only.

**Sections:**
- User management (list, create, edit, deactivate)
- Category management
- Organization settings

**Backend Entities:** users, categories, organizations

**Endpoints Used:**
- GET/POST/PUT /api/v1/admin/users
- GET/POST/PUT/DELETE /api/v1/admin/categories

---

## Authentication Flow

### Login Flow
1. User submits credentials
2. Backend validates and returns access_token + refresh_token
3. Frontend stores both tokens in localStorage
4. Access token used for all API requests

### Token Refresh Flow
1. API request returns 401
2. Interceptor queues the failed request
3. Interceptor calls /api/v1/auth/refresh with refresh_token
4. On success: Store new tokens, retry queued requests
5. On failure: Clear tokens, redirect to login

### Logout Flow
1. User clicks logout
2. Frontend clears both tokens from localStorage
3. Redirect to login page

---

## Error Handling

All API errors are handled with:
1. Console logging for debugging
2. User-friendly alert messages
3. Loading state management
4. Graceful degradation where possible

---

## Data Persistence

All data modifications follow this pattern:
1. User initiates edit
2. UI shows saving state
3. API call to backend
4. On success: Reload data from backend to confirm
5. On failure: Show error, keep edit mode open
6. Clear saving state

This ensures data consistency between frontend and backend.
