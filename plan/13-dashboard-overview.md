# Tache 13 - Tableau de bord overview inspire Waoh Digital

## Objectif
Refondre la page `Dashboard` pour offrir une vue 360° (ventes, factures, campagnes, satisfaction) avec le style UI WLAHWLA (cartes arrondies, ombres douces, gradient accent) et se baser sur les comportements observees sur waohdigital.com.

## Contexte
Le rapport met en avant les KPIs et CTA. Le dashboard actuel est generique; nous devons introduire des composants re-utilisables, des filtres multi filiales, un flux d activite et des quick actions.

## Pre-requis
- Taches 01 a 12.

## Actions detaillees
1. Definir la liste des indicateurs et sections (Revenu, Factures en attente, Campagnes actives, Satisfaction clients, Taches recentes) et consigner dans `docs/metrics/dashboard-overview.md` avec sources de donnees backend.
2. Developper des composants UI `KpiCard`, `SparklineCard`, `ActivityTimeline`, `QuickActionCard` dans `frontend/src/components/dashboard/` avec tokens (radius 24px, ombre `shadow-elevated`, accent `#5864FF`).
3. Mettre a jour `frontend/src/pages/Dashboard.tsx` pour integrer ces composants + un bandeau CTA `Voir la demo` type Waoh (degrade + CTA duo).
4. Brancher le dashboard sur des endpoints REST/GraphQL (mock via `frontend/src/mocks/dashboard.ts` puis connectez a l API une fois Taches 25-31 completes); prevoir un hook `useDashboardData`.
5. Ajouter filtres (periode, organisation, vertical) dans la barre superieure, stocker l etat dans URL (`searchParams`) et tester la persistance.

## Livrables
- Nouveaux composants dashboard + `Dashboard.tsx` refonte.
- Documentation `docs/metrics/dashboard-overview.md`.

## Verifications
- Tests unitaires/Storybook ou snapshot sur `KpiCard` et `ActivityTimeline`; lancer `npm run test` si ecris.
- Tests manuels (desktop/tablette/mobile) pour valider responsivite et fallback (loading/empty/error) + capture ecran a conserver dans `docs/branding/visual-references.md`.
