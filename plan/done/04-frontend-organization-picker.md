# Tache 04 - Mettre en place l onboarding organisation et le switcher

## Objectif
Permettre a un utilisateur rattache a plusieurs organisations de choisir le contexte actif et d initialiser les donnees obligatoires lors de la premiere connexion.

## Contexte
`core.middleware.OrganizationMiddleware` attend un code organisation via l en-tete `X-Org`, mais aucune interface frontend ne permet de choisir ou de memoriser cette valeur. `core/utils.py` retombe sur la premiere organisation, ce qui n est pas acceptable en production.

## Actions detaillees
- Ajouter un appel API `GET /api/organizations/` limite aux organisations du membre et afficher un selecteur dans l en-tete.
- Stocker le `org_code` choisi et l injecter dans chaque requete via un intercepteur axios (header `X-Org`).
- Lors de la premiere connexion, guider l utilisateur pour completer les champs critiques (adresse, tax_id, trade_register) via un formulaire dedie.
- Synchroniser la selection d organisation avec le backend afin de partager un lien direct (hash ou query contenant l identifiant).

## Livrables
- Switcher d organisation visible dans le layout.
- Gestion automatique du header `X-Org` dans `frontend/src/lib/api.ts`.
- Checklist d onboarding faite pour une organisation neuve.
