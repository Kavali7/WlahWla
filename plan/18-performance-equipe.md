# Tache 18 - Performance equipes & objectifs

## Objectif
Enrichir l espace administration avec un module de suivi des equipes (performance commerciale, satisfaction clients, gestion campagnes) inspiré des dashboards Waoh Digital.

## Contexte
Le rapport insiste sur les preuves de performance; WLAHWLA doit suivre les KPIs par employe et par equipe, fixer des objectifs et exposer les progrès.

## Pre-requis
- Taches 01 a 17.

## Actions detaillees
1. Definir la liste d indicateurs (factures emises, revenus, campagnes deployees, tickets resolus, NPS) et consigner formules/sources dans `docs/metrics/performance.md`.
2. Ajouter un onglet `Performance` dans `AdminPanel.tsx` ou `frontend/src/pages/admin/Performance.tsx` avec des sous onglets (Vue globale, Par equipe, Par employe, Objectifs).
3. Developper les composants `EmployeePerformanceTable`, `GoalProgressCard`, `PerformanceTrendChart` (sparkline, bar chart) avec tokens (fond `#F8F9FA`, cards arrondies).
4. Implementer un CRUD `Goals` (backend tache 31) et connecter le front via `useGoals` (creation, update, suivi) + notifications.
5. Ajouter export CSV/Excel + integration dans `docs/ops/performance-reporting.md`; capturer un screenshot pour `docs/branding/visual-references.md`.

## Livrables
- Module performance (pages + composants) + documentation metrics.
- Export rapports disponibilise.

## Verifications
- Tests unitaires sur les calculs front (mocks) + tests API (backend) pour les objectifs.
- Tests manuels: filtrer par equipe/employe, verifier fallback (aucune donnee) et telecharger un export.
