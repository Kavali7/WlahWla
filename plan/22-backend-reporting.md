# Tache 22 - Construire un moteur de reporting robuste

## Objectif
Fournir des rapports financiers et commerciaux exacts, filtrables par periode et organisation.

## Contexte
Les vues `backend/reports/views.py` utilisent des placeholders (ex: `unpaid_total = 0`, `low_stock` vide) et ne filtrent pas par organisation. Aucun cache ni parametre de periode n est gere.

## Actions detaillees
- Refactorer les requetes pour filtrer sur `organization` et la periode (params GET start/end).
- Ajouter des aggregations efficaces (index, annotation, `TruncMonth`) et eventuellement un cache Redis.
- Exposer de nouveaux endpoints pour top clients, taux de conversion devis -> factures, ruptures de stock.
- Ajouter des tests assurant la coherence des chiffres.

## Livrables
- Endpoints report fiables et documentes.
- Tableau des indicateurs calcules avec leurs definitions.
