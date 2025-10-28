# Tache 26 - Authentification & RBAC avancé

## Objectif
Mettre à jour le système d authentification/autorisation pour supporter les rôles WLAHWLA (OWNER, GROUP_ADMIN, BRANCH_MANAGER, OPERATOR, CLIENT) et la gestion multi filiales.

## Contexte
Avec les nouvelles interfaces (admin, pipeline, portail client), nous avons besoin d un RBAC fin, de jetons enrichis et d endpoints adaptés.

## Pre-requis
- Taches 01 a 25.

## Actions detaillees
1. Définir/valider la matrice de permissions (accès modules, actions CRUD) dans `backend/docs/security/rbac-matrix.md`.
2. Ajuster les modèles `Membership`, `Role`, `Permission` (ou équivalent) pour inclure hiérarchie multi organisation et champs `branch`.
3. Mettre à jour les permissions DRF (classes custom) et créer des endpoints exposant les droits et contexte (organisation active, filiale active).
4. Adapter la génération de tokens (JWT ou session) pour embarquer le rôle et la filiale; gérer bascule organisation (endpoint `POST /auth/switch-organization/`).
5. Ajouter tests unitaires/fonctionnels et documentation intégration (front) dans `backend/docs/security/auth.md`.

## Livrables
- RBAC revisité, endpoints nouveaux, documentation.

## Verifications
- Tests backend (`pytest`/`manage.py test`) sur permissions.
- Vérification manuelle (via Postman) des réponses 403/200 selon rôle + bascule d organisation.
