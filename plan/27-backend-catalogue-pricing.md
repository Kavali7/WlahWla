# Tache 27 - Catalogue & moteur de tarification

## Objectif
Mettre en place un moteur de tarification flexible pour produits, services et offres combinées (packs publicitaires + commerce), avec gestion par filiale et segment.

## Contexte
Le frontend (Taches 15, 14) nécessite des API pour simuler prix/taxes/remises. Le backend doit gérer listes de prix, promotions, bundles et règles spécifiques UEMOA.

## Pre-requis
- Taches 01 a 26.

## Actions detaillees
1. Concevoir les modèles `PriceList`, `PriceItem`, `DiscountRule`, `Bundle`, `CampaignTariff`; documenter structure dans `docs/catalog/pricing-engine.md`.
2. Implémenter le service métier (utilitaire Python) calculant prix final selon organisation, filiale, canal, quantité, période et promo active; gérer TVA locale.
3. Exposer endpoints REST/GraphQL : `GET /catalog/pricing-preview`, `POST /orders/quote`, `GET /bundles/` avec pagination et filtres.
4. Ajouter tests unitaires (services) et tests d intégration sur les endpoints; fournir fixtures de prix d exemple.
5. Mettre à jour l admin Django pour gérer listes de prix, bundles, remises et consigner la procédure marketing dans `docs/ops/pricing-management.md`.

## Livrables
- Moteur de tarification opérationnel + endpoints.
- Documentation technique + admin prêt.

## Verifications
- Tests automatisés (`manage.py test catalog`) et revues manuelles via `python manage.py shell`/`httpie`.
- Valider cas d usage marketing (promo filiale, pack cross-sell) et consigner résultats.
