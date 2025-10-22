# Tache 29 - API portail client et chat

## Objectif
Fournir les endpoints necessaires au portail client (commandes, factures, tickets, messages) et un micro-service de chat interne.

## Contexte
Le portail front (Tache 17) attend des APIs structurees. Un chat simple (long polling ou WebSocket) est requis.

## Pre-requis
- Taches 26 et 28.

## Actions detaillees
1. Creer des vues REST/GraphQL pour lister commandes, factures, documents d un client.
2. Ajouter un modele `ClientTicket` et un endpoint pour creer/suivre des tickets.
3. Mettre en place un canal WebSocket (Django Channels) ou fallback long polling pour le chat.
4. Documenter les contrats d API dans `docs/api/client-portal.md` et fournir des exemples.
5. Mettre a jour la documentation d authentification pour inclure tokens specifiques clients.

## Livrables
- Endpoints portail client operationnels.
- Documentation API.

## Verifications
- Manual: tester via Postman l authentification et la recuperation des donnees.
- Verifier la connexion WebSocket ou fallback et noter les limites.

