# Tache 16 - Gestion des prestations et planning

## Objectif
Fournir une interface pour planifier les prestations de services (interventions, consulting) avec calendrier et suivi des equipes.

## Contexte
Il manque une vue planning. WLAHWLA doit permettre d assigner des employes, suivre l avancement et gerer des documents (feuilles de route).

## Pre-requis
- Tache 15 pour differencier services.

## Actions detaillees
1. Creer `src/pages/services/Scheduler.tsx` avec un calendrier (utiliser `react-big-calendar` ou `FullCalendar`).
2. Ajouter un composant `ServiceAssignmentModal` pour assigner ressources et documents.
3. Connecter la vue a une API mock `src/mocks/services.ts` en attendant les taches backend (28).
4. Implementer des badges de statut (Planifie, En cours, Termine, A facturer) et lier aux notifications (Tache 20).
5. Ajouter un export PDF ou ICS (manuel via bouton) documente dans `docs/ops/service-scheduling.md`.

## Livrables
- Page Scheduler fonctionnelle.
- Documentation d utilisation.

## Verifications
- Manual: verifier l ajout, modification, suppression d evenements.
- Contraster les couleurs de statut pour accessibilite (outil contraste).

