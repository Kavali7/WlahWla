# Tache 18 - Implementer les permissions basees sur les roles

## Objectif
Aligner les autorisations API avec les roles definis dans `backend/core/models.py` (Membership) pour proteger les operations sensibles.

## Contexte
Toutes les routes utilisent `IsAuthenticated` ou `IsAdminOrReadOnly`, ce qui n exploite pas les roles (ADMIN, ACCOUNTANT, SALES, WAREHOUSE, VIEWER). Les membres non admin peuvent actuellement creer utilisateurs, factures ou mouvements.

## Actions detaillees
- Definir des classes DRF personnalisees (ex: `IsOrgAdmin`, `CanManageBilling`, `CanManageInventory`) basees sur le membership courant.
- Brancher ces permissions sur les viewsets correspondants (produits, inventaire, billing, reports).
- Ajouter un mixin pour charger le membership actif sur `request`.
- Documenter la matrice des droits et la communiquer au frontend pour controler l UI.

## Livrables
- Permissions personnalisees et tests unitaires verifies.
- Documentation de la matrice des roles.
