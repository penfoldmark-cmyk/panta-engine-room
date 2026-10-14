# Panta Engine Room

Prototype of the Engine Room, Panta's operations area for running indices in production. Lab is where indices are designed and backtested. The Engine Room is where Panta Engine runs them live.

## Goal

A full working prototype that shows how ops teams (Panta's and clients') monitor, triage and fix production index calculation, with an agent layer that diagnoses issues and proposes actions for a person to approve.

## Why

The same operational needs keep coming up across clients and trials:

- Run status, timeouts and failure alerts, with dependency ordering
- Feed health and data readiness, and auto-calc when inputs arrive
- Validation exceptions with in-place fixes (missing values, stale prices, identifier drops)
- Corrections and overrides, single or bulk, audited
- Universe-wide corporate action calendar and history
- Restatements: impact, recalculation window, estimated vs final versions
- Audit trail of data versions and add/drop rationale

Positioning: ops tooling for the client's own team, not a managed ops service.

## Site structure

| Section | Purpose |
|---|---|
| Brief | Agent-written summary of the day: decisions waiting, suggested checks, what Engine handled itself |
| Inbox | All proposals across days |
| Investigate | Ask Engine; traces any index, run or number back to its inputs |
| Monitor | Data tasks linked to index families (task-monitor model); status, last and next run, trigger source |
| Runs | Run list and run detail: load, validate, calculate, publish |
| Data feeds | Freshness per vendor file, coverage gaps, dependent indices |
| Exceptions | Validation queue with exclude, fill, override, hold and release |
| Corporate actions | Upcoming calendar and history; links to rulebooks in Lab |
| Restatements | Revisions, affected indices, recalc policy, versions |
| Autonomy | Per action type: observe, suggest, act with approval, act and report |
| Audit | Every action by people and by the agent |

## Key states

- Data tasks: Ready, Waiting on inputs, In progress, Late, Success, Failed
- Index families and runs: Waiting on inputs, In progress, Success, Partial success, Held, Failed
- Proposals: Needs approval, Approved, Rejected, Handled by Engine

Publishing always needs a person. The agent can recalculate, retry and diagnose on its own, depending on the autonomy setting.

## Stack and conventions

- Angular 20, standalone components, signals, zoneless change detection
- One component per file in `src/app/`; example data in `src/app/data.ts`
- Global design tokens in `src/styles.css` (Panta dark: blue `#4b8ff0`, teal `#1fb3a3`, green `#3fd18b`, brand gradient as a thin top band)
- Font: Geist; tabular numbers everywhere
- Example data only. Never use real client names.

## Working across chats

Each chat in the "Operations Module" project owns one area:

1. Spec and IA
2. Design system
3. Brief and Inbox
4. Monitor (data tasks and index families)
5. Exceptions and corrections
6. Corporate actions and restatements
7. Agent layer: Ask Engine, Autonomy, Audit
8. Integration and final prototype

Rules:

- Pull `main` before starting. Work on a branch named after the area, for example `area/monitor`.
- Only change shared files (`styles.css`, `data.ts`, `glyph.ts`, `app.ts`) in the Design system or Integration chats, or say so in the commit message.
- Build before pushing: `npm ci && npx ng build --output-hashing=none`.
- The published prototype is one artifact link, republished from the built `main.js` and `styles.css`.

## Run locally

```
npm ci
npx ng serve
```
