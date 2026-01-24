# KAM OS - Phase 2A Frontend Architecture Documentation

## Overview

This document describes the frontend architectural changes made during Phase 2A of the KAM OS refactoring. The goal was to create a feature-based, modular architecture that supports the Account Workspace KAM experience.

## Architecture Before Phase 2A

The frontend had a component-based structure with large monolithic files:

```
src/
  components/
    kam/
      PlanoKAM.tsx       # 2138 lines - monolithic component
    ui/                  # shadcn/ui components
  pages/
  services/
  App.tsx
```

**Problems:**
- PlanoKAM.tsx was 2138 lines with 6 major components
- No clear feature separation
- Difficult to maintain and test
- Components tightly coupled
- No reusable patterns

## Architecture After Phase 2A

The frontend now follows a feature-based architecture:

```
src/
  features/                          # Feature modules
    kam-plan/                        # KAM Plan feature
      components/
        KAMPlanTabs.tsx              # Tab navigation
        DiagnosticoContexto.tsx      # Diagnostic context
        MapaStakeholders.tsx         # Stakeholder mapping
        WalletShare.tsx              # Wallet share analysis
        PlanoAcaoKAM.tsx             # Action plan
        RiscosConcorrencia.tsx       # Risks and competitors
        AnatomiaKAM.tsx              # KAM maturity assessment
      hooks/                         # Feature-specific hooks
      services/                      # Feature-specific services
      types/
        index.ts                     # Type definitions
      index.ts                       # Public exports
    
    account-workspace/               # Account Workspace feature
      components/
        AccountWorkspaceKAM.tsx      # Integrated workspace
      hooks/
      index.ts
    
    index.ts                         # Feature exports
  
  components/
    kam/
      PlanoKAM.tsx                   # Original (kept for backward compatibility)
    ui/                              # shadcn/ui components
  
  pages/
  services/
  App.tsx
```

## Feature Modules

### kam-plan

The KAM Plan feature module contains all components related to KAM plan management:

**Components:**
- `KAMPlanTabs`: Tab navigation for KAM plan sections
- `DiagnosticoContexto`: Diagnostic context with SWOT analysis and pain points
- `MapaStakeholders`: Stakeholder mapping with power/support/relationship levels
- `WalletShare`: Wallet share analysis with revenue tracking
- `PlanoAcaoKAM`: Action plan management with status tracking
- `RiscosConcorrencia`: Risk and competitor analysis
- `AnatomiaKAM`: KAM maturity assessment with 6 pillars

**Types:**
- `KAMPillar`: Pillar definition with maturity items
- `DiagnosticData`: Diagnostic data with SWOT
- `Pain`: Pain point definition
- `Stakeholder`: Stakeholder profile
- `WalletShareLine`: Business line with revenue data
- `KAMAction`: Action item with status
- `Risk`: Risk definition with probability/impact
- `Competitor`: Competitor profile
- `KAMPlanTab`: Tab type union

### account-workspace

The Account Workspace feature provides an integrated experience for managing accounts:

**Components:**
- `AccountWorkspaceKAM`: Unified workspace integrating:
  - Account overview with health metrics
  - KAM Plan (via KAMPlanTabs)
  - Meetings (placeholder for future)
  - Insights IA (placeholder for future)
  - Next Actions (placeholder for future)

## Component Breakdown

The original PlanoKAM.tsx (2138 lines) was broken into:

| Component | Lines | Responsibility |
|-----------|-------|----------------|
| DiagnosticoContexto | ~350 | Context, SWOT, pain points |
| MapaStakeholders | ~320 | Stakeholder mapping |
| WalletShare | ~260 | Revenue analysis |
| PlanoAcaoKAM | ~290 | Action management |
| RiscosConcorrencia | ~410 | Risks and competitors |
| AnatomiaKAM | ~330 | Maturity assessment |
| KAMPlanTabs | ~100 | Tab navigation |

Total: ~2060 lines across 7 files (average ~295 lines per file)

## Design Principles

1. **Feature-Based Organization**: Code organized by business feature, not technical layer
2. **Single Responsibility**: Each component has one clear purpose
3. **Type Safety**: Strong TypeScript types for all data structures
4. **Reusability**: Components can be used independently or composed
5. **Backward Compatibility**: Original PlanoKAM.tsx kept for existing usage

## Usage

### Using KAM Plan Tabs

```tsx
import { KAMPlanTabs } from '@/features/kam-plan';

function MyComponent() {
  return <KAMPlanTabs accountId="123" defaultTab="diagnostico" />;
}
```

### Using Account Workspace

```tsx
import { AccountWorkspaceKAM } from '@/features/account-workspace';

function MyPage() {
  return <AccountWorkspaceKAM accountId="123" />;
}
```

### Using Individual Components

```tsx
import { 
  DiagnosticoContexto, 
  MapaStakeholders,
  WalletShare 
} from '@/features/kam-plan';

function CustomView({ accountId }: { accountId: string }) {
  return (
    <div>
      <DiagnosticoContexto accountId={accountId} />
      <MapaStakeholders accountId={accountId} />
      <WalletShare accountId={accountId} />
    </div>
  );
}
```

## Trade-offs

1. **More Files**: The new structure has more files, but each is focused and maintainable
2. **Import Paths**: Longer import paths, but clearer organization
3. **Duplication**: Some code duplicated from original (types, helpers), but isolated

## Future Improvements

1. **Add Custom Hooks**: Extract data fetching logic into custom hooks
2. **Add React Query**: Replace useState/useEffect with React Query for server state
3. **Add Zustand**: Add global state management for cross-component state
4. **Add Tests**: Add unit tests for each component
5. **Add Storybook**: Add Storybook stories for component documentation
6. **Complete Workspace**: Implement Meetings, Insights, and Actions modules
