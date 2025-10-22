# Tache 26 - Authentification, roles et politiques

## Objectif
Mettre a jour le systeme d authentification pour gerer les roles (ADMIN, MANAGER, EMPLOYEE, CLIENT) et les permissions associees (multi filiales, c-panel).

## Contexte
Les roles actuels sont limites. Les nouvelles vues necessitent des autorisations fines.

## Pre-requis
- Tache 25.

## Actions detaillees
1. Definir la matrice des droits dans `docs/security/rbac-matrix.md`.
2. Mettre a jour les models `Membership`/`Role` et les decorators/permissions DRF.
3. Ajouter des endpoints pour recuperer les roles et permissions par utilisateur.
4. Mettre a jour la generation de tokens (ou JWT) pour inclure les roles et filiale active.
5. Adapter les middlewares frontend pour consommer ces infos.

## Livrables
- Code backend RBAC mis a jour.
- Documentation de la matrice de droits.

## Verifications
- Tests unitaires pour les permissions (`tests/test_permissions.py`).
- Manual: appeler une route protegee avec un role insuffisant et verifier la reponse 403.

