# Tache 16 - Mettre en place l authentification API securisee

## Objectif
Fournir une authentification robuste (login, refresh, permissions) pour proteger toutes les routes API.

## Contexte
`config/settings.py` configure uniquement Session et Basic Authentication. Aucune route de login n est exposee et la page AdminPanel consomme `/api/users/` sans controle. Pour une application installee via lien, un schema token ou JWT est necessaire.

## Actions detaillees
- Introduire `djangorestframework-simplejwt` (ou schema token equivalent) et enregistrer les classes dans `REST_FRAMEWORK`.
- Ajouter des endpoints `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`.
- Mettre a jour les vues existantes pour exiger l authentification et retourner 401 sinon.
- Enregistrer un signal ou un log pour journaliser les connexions importantes.

## Livrables
- Nouveau module d authentification avec routes actives.
- Parametrage REST mis a jour et documente.
- Tests unitaires basiques de login et refresh.
