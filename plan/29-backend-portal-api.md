# Tache 29 - API portail client & support

## Objectif
Fournir les API nécessaires au portail client (commandes, factures, campagnes, tickets, messages) avec une communication temps réel basique.

## Contexte
Le portail client (Tache 17) attend des endpoints structurés et un canal de conversation. Nous devons offrir un backend documentaire et sécurisé.

## Pre-requis
- Taches 01 a 28.

## Actions detaillees
1. Créer endpoints REST/GraphQL pour `ClientDashboard` (liste commandes, factures, campagnes, documents) filtrés par client/organisation.
2. Implémenter la gestion des tickets support : modèle `ClientTicket`, API CRUD, pièces jointes, timeline.
3. Mettre en place un canal communication (Django Channels ou long polling) pour le chat client <-> équipe et exposer WebSocket `/ws/support/`.
4. Ajouter endpoints pour checklist onboarding, ressources, notifications client; respecter permissions RBAC.
5. Documenter tous les contrats d API dans `backend/docs/api/client-portal.md` avec exemples curl/Postman et tests automatisés (pytest).

## Livrables
- API portail client complète (REST/WS).
- Documentation `client-portal.md`.

## Verifications
- Tests automatisés sur endpoints + WebSocket (Channels tests).
- Tests manuels Postman/HTTPie: authentification client, ticket création, réception message temps réel.
