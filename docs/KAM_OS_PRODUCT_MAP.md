# KAM OS - Product Map

## Product Vision

KAM OS is the Operating System for B2B Relationship Execution. It transforms how companies manage their strategic accounts by making execution the center of the experience, not data entry.

## Dominant Flow

The core product flow that every feature supports:

```
┌─────────┐    ┌─────────┐    ┌───────────┐    ┌──────────┐
│ Meeting │───>│   AI    │───>│ Diagnostic│───>│ Strategy │
└─────────┘    │ Analysis│    └───────────┘    └──────────┘
               └─────────┘                           │
                                                     ▼
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌──────────┐
│ Result  │<───│Execution│<───│ Actions │<───│   Plan   │
└─────────┘    └─────────┘    └─────────┘    └──────────┘
```

## Product Hierarchy

### Level 1: Core Nucleus
The KAM Plan is the operational heart of the system.

```
                    ┌─────────────────────┐
                    │      KAM PLAN       │
                    │   (Core Nucleus)    │
                    └─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Diagnostic   │    │  Stakeholder  │    │    Action     │
│   & Context   │    │     Map       │    │     Plan      │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Wallet Share  │    │ Value Matrix  │    │    Risks &    │
│               │    │               │    │  Competition  │
└───────────────┘    └───────────────┘    └───────────────┘
```

### Level 2: Supporting Features
Features that feed into and support the KAM Plan.

| Feature | Purpose | Feeds Into |
|---------|---------|------------|
| Meetings | Capture client interactions | AI Analysis → Diagnostic |
| AI Analysis | Extract insights from meetings | Diagnostic, Actions |
| Contacts | Manage stakeholder information | Stakeholder Map |
| Opportunities | Track revenue potential | Wallet Share |
| Activities | Schedule and track tasks | Action Plan |

### Level 3: Analytics & Reporting
Features that measure and report on execution.

| Feature | Purpose | Data Source |
|---------|---------|-------------|
| Dashboard | Overview metrics | All entities |
| Reports | Detailed analysis | All entities |
| Account Health | Risk indicators | KAM Plan, Activities |
| Prioritization | Account ranking | Accounts, Opportunities |

## Screen Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION                            │
│  ┌─────────┐  ┌──────────┐  ┌────────────────┐  ┌────────────┐ │
│  │  Login  │  │ Register │  │ Forgot Password│  │Reset Password│
│  └─────────┘  └──────────┘  └────────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MAIN APP                                 │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      DASHBOARD                           │    │
│  │  Metrics Overview │ Quick Actions │ Recent Activity      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐             │
│         │                    │                    │             │
│         ▼                    ▼                    ▼             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │  ACCOUNTS   │     │  CONTACTS   │     │OPPORTUNITIES│       │
│  │    List     │     │    List     │     │    List     │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   ACCOUNT DETAIL                         │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │    │
│  │  │  Info   │ │Contacts │ │  Opps   │ │Activities│       │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                   │    │
│  │  │KAM Plan │ │  Value  │ │Meetings │                   │    │
│  │  │         │ │ Matrix  │ │         │                   │    │
│  │  └─────────┘ └─────────┘ └─────────┘                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      KAM PLAN                            │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐             │    │
│  │  │Diagnostic │ │Stakeholder│ │  Wallet   │             │    │
│  │  │ & Context │ │    Map    │ │   Share   │             │    │
│  │  └───────────┘ └───────────┘ └───────────┘             │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐             │    │
│  │  │  Action   │ │  Risks &  │ │    KAM    │             │    │
│  │  │   Plan    │ │Competition│ │  Anatomy  │             │    │
│  │  └───────────┘ └───────────┘ └───────────┘             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │ ACTIVITIES  │     │  MEETINGS   │     │PRIORITIZATION│      │
│  │    List     │     │    List     │     │   Matrix    │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      REPORTS                             │    │
│  │  Pipeline │ Forecast │ Activities │ Health │ Value │ KAM│    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │   PROFILE   │     │  SETTINGS   │     │    ADMIN    │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

## Feature Status Matrix

| Feature | Status | Backend | Frontend | Notes |
|---------|--------|---------|----------|-------|
| **Authentication** |
| Login | Complete | Yes | Yes | JWT + Refresh tokens |
| Register | Complete | Yes | Yes | Auto org creation |
| Forgot Password | Complete | Yes | Yes | Email via Resend |
| Reset Password | Complete | Yes | Yes | Token-based |
| Refresh Token | Complete | Yes | Yes | Auto-refresh on 401 |
| **Accounts** |
| List | Complete | Yes | Yes | Paginated |
| Create | Complete | Yes | Yes | |
| Edit | Complete | Yes | Yes | All fields persist |
| Delete | Complete | Yes | Yes | |
| **Contacts** |
| List | Complete | Yes | Yes | |
| CRUD | Complete | Yes | Yes | |
| **Opportunities** |
| List | Complete | Yes | Yes | |
| CRUD | Complete | Yes | Yes | |
| **Activities** |
| List | Complete | Yes | Yes | |
| CRUD | Complete | Yes | Yes | |
| **KAM Plan** |
| Diagnostic | Complete | Yes | Yes | Backend-connected |
| Stakeholder Map | Complete | Yes | Yes | Backend-connected |
| Wallet Share | Complete | Yes | Yes | Backend-connected |
| Action Plan | Complete | Yes | Yes | Backend-connected |
| Risks | Complete | Yes | Yes | Backend-connected |
| Competitors | Complete | Yes | Yes | Backend-connected |
| KAM Anatomy | Complete | Yes | Yes | Backend-connected |
| **Value Matrix** |
| Attributes | Complete | Yes | Yes | CRUD operations |
| **Meetings** |
| List | Complete | Yes | Yes | |
| Create | Complete | Yes | Yes | |
| AI Analysis | Complete | Yes | Yes | OpenAI integration |
| **Reports** |
| Pipeline | Complete | Yes | Yes | Real data |
| Forecast | Complete | Yes | Yes | Real data |
| Activities | Complete | Yes | Yes | Real data |
| Health | Complete | Yes | Yes | Real data |
| Value | Complete | Yes | Yes | Real data |
| KAM Plan | Complete | Yes | Yes | Real data |
| Excel Export | Complete | N/A | Yes | Multi-sheet .xlsx |
| **Admin** |
| User Management | Complete | Yes | Yes | |
| Categories | Complete | Yes | Yes | |
| **User** |
| Profile | Complete | Yes | Yes | Name editing |
| Settings | Partial | N/A | Yes | localStorage only |
| **Notifications** |
| System | Placeholder | No | Yes | Empty state shown |

## User Journeys

### Journey 1: New Account Setup
```
1. Login
2. Dashboard → Click "New Account"
3. Fill account information
4. Save account
5. Navigate to KAM Plan tab
6. Fill Diagnostic & Context
7. Add Stakeholders
8. Define Wallet Share lines
9. Create Action Plan
10. Identify Risks & Competitors
```

### Journey 2: Meeting to Action
```
1. Login
2. Navigate to Meetings
3. Create new meeting with notes
4. System generates AI analysis
5. Review insights (pain points, solutions, next steps)
6. Navigate to related account
7. Update KAM Plan based on insights
8. Create new actions from suggestions
```

### Journey 3: Executive Review
```
1. Login
2. Navigate to Reports
3. Select date range and filters
4. Review Pipeline status
5. Check Account Health scores
6. Review KAM Plan execution rates
7. Export to Excel for presentation
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER ACTIONS                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                            │
│                                                                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │   Pages     │────>│  API Layer  │────>│   Context   │       │
│  │ Components  │<────│  (axios)    │<────│   State     │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                              │                                   │
└──────────────────────────────┼──────────────────────────────────┘
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                           │
│                                                                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │   Routers   │────>│  Services   │────>│Repositories │       │
│  │  (API)      │<────│  (Logic)    │<────│  (Data)     │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                              │                                   │
└──────────────────────────────┼──────────────────────────────────┘
                              │ SQL
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (PostgreSQL)                       │
│                                                                  │
│  organizations │ users │ accounts │ contacts │ meetings         │
│  opportunities │ activities │ kam_plans │ value_matrix          │
└─────────────────────────────────────────────────────────────────┘
```

## Integration Points

### External Services

| Service | Purpose | Status |
|---------|---------|--------|
| OpenAI GPT-4o-mini | Meeting analysis | Configured |
| OpenAI Whisper | Audio transcription | Configured |
| Resend | Email delivery | Configured |
| Railway | Backend hosting | Active |

### API Integration Pattern

All frontend-backend communication follows this pattern:

```typescript
// 1. Component mounts
useEffect(() => {
  loadData();
}, [accountId]);

// 2. Load data from backend
const loadData = async () => {
  setLoading(true);
  try {
    const data = await api.getData(accountId);
    setState(data);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

// 3. Save changes to backend
const handleSave = async () => {
  setSaving(true);
  try {
    await api.saveData(accountId, formData);
    await loadData(); // Reload to confirm
  } catch (error) {
    alert('Error saving');
  } finally {
    setSaving(false);
  }
};
```

## Roadmap Considerations

### Completed in This Phase
- Account form editing with full field persistence
- KAM Plan components connected to backend APIs
- Refresh token implementation
- Profile and Settings pages
- Reports with real data and Excel export
- Meetings with AI analysis integration

### Future Considerations
- Real-time notifications system
- Dark mode implementation
- Mobile-responsive improvements
- Offline support
- Advanced analytics dashboards
- Team collaboration features
- Calendar integration
- Email integration for follow-ups

## Success Metrics

The system should be measured by:

1. **Adoption** - Number of active KAM Plans
2. **Engagement** - Actions created per account
3. **Execution** - Action completion rate
4. **Insights** - AI analyses generated
5. **Value** - Wallet share growth tracked

## Glossary

| Term | Definition |
|------|------------|
| KAM | Key Account Management |
| KAM Plan | Strategic execution plan for an account |
| Wallet Share | Percentage of customer's total spend captured |
| Stakeholder Map | Visual representation of key contacts and their influence |
| Value Matrix | Mapping of value attributes to stakeholder perceptions |
| ABC Category | Account classification (A=Strategic, B=Growth, C=Maintain) |
| Prioritization Score | Calculated score for account ranking |
| Health Status | Overall account relationship health indicator |
