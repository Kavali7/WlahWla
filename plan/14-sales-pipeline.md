# Tache 14 - Pipeline ventes & commandes

## Objectif
Construire une vue pipeline/kanban pour suivre prospects, devis, commandes et livraisons avec un design inspire des cartes waohdigital (hover, stats) et une experience drag & drop fluide.

## Contexte
Le rapport met en avant la simplicite des CTA et des cartes. Nous devons offrir aux equipes commerciales une interface claire reliant opportunites, devis, paiements et campagnes.

## Pre-requis
- Taches 01 a 13.

## Actions detaillees
1. Definir les colonnes pipeline (Prospection, Devis emis, Facturation, Livraison, Suivi) + champs affiches sur les cartes; documenter le mapping API dans `docs/ux/sales-pipeline.md`.
2. Developper `SalesPipelineBoard` dans `frontend/src/components/sales/` (cartes arrondies, metrics, boutons rapides) avec `react-beautiful-dnd` ou alternative et fallback accessible.
3. Creer la page `frontend/src/pages/sales/Pipeline.tsx` integrant filtres (vertical, assignation, periode) relies au header dashboard (Tache 13) via context/global state.
4. Implementer les APIs backend (Taches 27-28) : endpoints CRUD pipeline, actions `convert_to_invoice`, `assign_member`; en attendant, fournir un mock `frontend/src/mocks/pipeline.ts`.
5. Ajouter une vue liste compacte pour mobile (toggle board/list) et consigner les interactions (keyboard drag) dans `docs/ops/accessibilite.md`.

## Livrables
- Composant `SalesPipelineBoard` + page `Pipeline.tsx`.
- Documentation `docs/ux/sales-pipeline.md`.

## Verifications
- Tests unitaires sur le mapping etats -> colonnes et sur les actions rapides (`npm run test sales-pipeline`).
- Tests manuels : drag & drop souris, reordre clavier (si dispo), fallback list sur mobile; capture ecran/video pour `docs/branding/visual-references.md`.
