# Tache 16 - Planning prestations & missions

## Objectif
Mettre en place une experience de planification pour les services (consulting, interventions, onboarding client) avec calendrier, suivi d avancement et documents partageables.

## Contexte
Le rapport met en avant des parcours services; WLAHWLA doit offrir un module calendrier rappelant les bonnes pratiques (cartes lisses, badges statut) et lier les missions au pipeline ventes/facturation.

## Pre-requis
- Taches 01 a 15.

## Actions detaillees
1. Concevoir les statuts et workflows (Planifie, En preparation, En cours, A facturer, Cloture) et consigner dans `docs/domain/services.md` avec roles autorises.
2. Developper `Scheduler` dans `frontend/src/pages/services/Scheduler.tsx` avec `react-big-calendar` ou `FullCalendar`, theme personalise (palette WLAHWLA) et vue semaine/mois.
3. Ajouter les composants `ServiceAssignmentModal`, `MissionDrawer` pour assigner ressources, joindre documents (liens) et planifier rappels (lien Tache 30 notifications).
4. Brancher sur API mock `frontend/src/mocks/services.ts`, puis sur endpoints backend (Tache 28) incluant creation/edition, assignation, changement statut; gerer offline fallback.
5. Documenter l usage (export ICS/PDF, workflow) dans `docs/ops/service-scheduling.md` et noter les assets/captures a produire.

## Livrables
- Page Scheduler fonctionnelle + composants modaux/drawer.
- Documentation `docs/domain/services.md` et `docs/ops/service-scheduling.md`.

## Verifications
- Tests manuels creation/modification/suppression mission + changement statut (desktop + mobile).
- Verifier contrastes badges (outil WebAIM) et accessibilite clavier du calendrier; consigner resultats.
