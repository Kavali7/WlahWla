# Tache 07 - Creer les ecrans de suivi de stock et fournisseurs

## Objectif
Suivre les mouvements de stock et les fournisseurs afin de piloter le disponible a la vente et les approvisionnements.

## Contexte
Les endpoints `backend/inventory/views.py` (Supplier et StockMovement) existent mais aucune interface ne les exploite. De plus le Dashboard affiche `low_stock_count` qui reste a zero faute de calculs et de visualisation.

## Actions detaillees
- Mettre en place une liste des fournisseurs avec formulaire CRUD basique.
- Afficher l historique des mouvements de stock (entree, sortie, ajustement) avec filtres par periode et produit.
- Ajouter un formulaire pour saisir un mouvement de stock en liant produit, quantite et reference.
- Preparer des vues de synthese (stock disponible par produit) en attendant la logique backend definitive.

## Livrables
- Pages inventaire et fournisseurs operationnelles.
- Checklist de tests (creation mouvement IN/OUT, validation des champs obligatoires).
