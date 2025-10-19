# Tache 19 - Completer la logique d inventaire et calcul de stock

## Objectif
Calculer les stocks disponibles par produit et exposer ces informations aux autres modules (dashboard, boutique).

## Contexte
`backend/inventory/models.py` enregistre les mouvements mais ne met pas a jour de stock cumule et `reports/views.py` retourne `low_stock_count = 0`. Le storefront ne sait pas si un produit est en rupture.

## Actions detaillees
- Ajouter un modele `ProductStock` (ou champs sur `Product`) pour suivre le stock courant, le stock de securite et le seuil de rupture.
- Mettre a jour la logique lors de chaque mouvement IN/OUT/ADJUST pour recalculer le stock et historiser les ajustements.
- Exposer un endpoint pour consulter le stock et informer la boutique (quantite disponible, statut rupture).
- Ajouter des tests couvrant les ajustements et les environnements multi organisations.

## Livrables
- Stock calcule et stocke de maniere fiable.
- Endpoints documentes pour le frontend.
