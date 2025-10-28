# Tache 21 - Multi comptes & filiales

## Objectif
Étendre la gestion multi organisation pour permettre aux groupes UEMOA d administrer filiales, basculer rapidement et consolider les données (KPIs, rapports).

## Contexte
Le sélecteur d organisation est partiel. Le rapport insiste sur l importance d une vision groupe. Nous devons fournir une UX claire pour les holdings (navigation hiérarchique, permissions).

## Pre-requis
- Taches 01 a 20.

## Actions detaillees
1. Définir les scenarios multi-org (groupe > filiales > points de vente) et les rôles associés (OWNER, GROUP_ADMIN, BRANCH_MANAGER); documenter dans `docs/admin/multi-org.md`.
2. Étendre `OrganizationOnboarding` pour créer filiales avec métadonnées (pays, fuseau, devise, langue) et un workflow d’approbation (backend tache 26).
3. Refonte `OrganizationPicker` : menu hiérarchique, recherche, épinglage des favoris; afficher l info filiale active dans l AppLayout (bandeau).
4. Adapter Auth store / context pour gérer l état `activeOrganizationId`, `activeBranchId` et recalculer les KPIs en conséquence (hooks `useOrganization`, `useBranch`).
5. Ajuster dashboards/rapports pour respecter ce contexte (filtres auto) et consigner les tests dans `docs/ops/multi-org-checklist.md`.

## Livrables
- Picker multi-niveau, onboarding filiales, documentation.
- Context/auth mis à jour + dashboards compatibles.

## Verifications
- Tests manuels : création filiale, bascule, vérification métriques actualisées.
- Tests unitaires sur hooks/context (front) et endpoints multi organisation (backend).
