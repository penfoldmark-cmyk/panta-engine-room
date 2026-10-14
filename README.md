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

The prototype is built inside the real PANTA dashboard app, not as a standalone page.

- Location: `PANTA Repo/panta-dashboard-main/panta-dashboard-main/projects/proto/engine-room/` on Mark's laptop (the dashboard repo is not in git)
- Follow `PANTA-Prototype-Design-System.md` (in the project and in `PANTA Repo`): `pds-*` components, `--pds-*` tokens, Oswald for titles and buttons, Source Sans 3 for labels and values, square corners, dark theme only
- Mock data in the root-provided `EngineRoomStore` (signals, `simulate…()` methods); no NGXS, no HTTP
- Navigation: `EngineRoomConfigService` in `projects/proto/index.ts`, registered in `src/app/app.config.ts`; route `/:clientId/engine-room`
- Strings in `public/i18n/en.json` under `PROTO_ENGINE_ROOM.*` and `NAV.PROTO_*`
- Check before hand-over: `npx ngc -p tsconfig.app.json --noEmit` and `npx eslint projects/proto`
- pds-icons glyphs that exist: add, calendar, search, run, save, upload, download, export, copy, close, delete, template, wizard, info, more, notification and a few others. Anything else (calculate, refresh, warning) needs `iconType="material"`
- Example data only. Never use real client names.

Built so far: Brief (`brief/`), with the day track, item detail, Ask Engine and reject dialogs.

The standalone Angular app in this GitHub repo was the first draft and is superseded.

## Working across chats

- First draft (superseded, standalone Angular): https://github.com/penfoldmark-cmyk/panta-engine-room and https://claude.ai/artifact/KWS4KJC3XyhdkozjRP7M1R

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

- Link the chat to Mark's computer and work in `projects/proto/engine-room/` in the dashboard repo.
- Only change shared files (`engine-room-store.ts`, `engine-room.model.ts`, `engine-room-seed.ts`, `projects/proto/index.ts`) in the Spec or Integration chats, or say so in the hand-over.
- Type-check and lint before hand-over.

## Run locally

In the dashboard repo: `ng serve --configuration local` (the `dashboard` entry in `PANTA Repo/.claude/launch.json`), then open `/<clientId>/engine-room`. The page uses only the mock store, so it works with either the local shim or the dev gateway login.
