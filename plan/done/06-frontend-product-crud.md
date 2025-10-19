# Tache 06 - Construire le module de gestion des produits

## Objectif
Donner aux equipes la possibilite de gerer le catalogue produits (liste, creation, edition, archivage) depuis une interface ergonomique.

## Contexte
Le frontend ne propose aucun CRUD pour les produits alors que l API `backend/products/views.py` expose toutes les operations. Les utilisateurs doivent pouvoir regler la TVA, l unite de mesure et l etat actif.

## Actions detaillees
- Creer une page ou un onglet dedie avec tableau triable, recherche et pagination.
- Ajouter des formulaires modaux pour creer et modifier un produit (nom, SKU, prix, tax, uom, statut).
- Integrer la gestion des unites (`/api/units/`) et des taxes (`/api/taxes/`) via des selects dynamiques.
- Prevoir l import CSV simple (en option) ou au minimum la duplication d un produit.

## Livrables
- Nouveau module UI connecte aux endpoints produits.
- Documentation courte pour les utilisateurs expliquant le flux de creation produit.
