# Tache 28 - Workflows commandes & prestations

## Objectif
Mettre en place un workflow complet pour commandes et missions de service : devis → validation → exécution → facturation → clôture avec notifications et audit.

## Contexte
Le domaine WLAHWLA nécessite un suivi précis. Nous devons définir les états, transitions et API pour alimenter pipeline, planning et notifications.

## Pre-requis
- Taches 01 a 27.

## Actions detaillees
1. Formaliser les workflows (commandes, services) dans `backend/docs/ops/order-workflow.md` avec diagramme états/transitions + responsabilités.
2. Étendre les modèles `Order`, `OrderItem`, `ServiceAssignment`, `WorkflowEvent` avec champs statut, timestamps, commentaires, pièces jointes.
3. Implémenter services métiers (state machine) pour valider transitions, déclencher signaux/notifications (Tache 30), mettre à jour métriques.
4. Exposer endpoints sécurisés (`POST /orders/{id}/transition`, `POST /services/{id}/transition`) + endpoints timeline (events).
5. Ajouter tests d intégration (API) et fixtures covering scenarios; consigner guide dev dans `backend/docs/ops/workflow-handbook.md`.

## Livrables
- Workflows backend complets + documentation.
- Tests couvrant transitions principales.

## Verifications
- Tests automatisés (`manage.py test orders services`).
- Simulation manuelle via shell/API pour vérifier enchaînements, notifications déclenchées et audit log.
