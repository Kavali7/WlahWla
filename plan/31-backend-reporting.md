# Tache 31 - Reporting et analytics

## Objectif
Mettre en place un module reporting (tableaux de bord, exports) reliant les donnees ventes, services, performance, campagnes.

## Contexte
Le front (Taches 13 et 18) requiert des APIs de reporting robustes.

## Pre-requis
- Tache 25.

## Actions detaillees
1. Definir les metriques calculables et les regrouper dans `docs/metrics/reporting-spec.md`.
2. Creer des vues materialisees ou requetes optimisees pour generer les KPIs (Django ORM + window functions si necessaire).
3. Exposer des endpoints `/api/reporting/*` avec filtres (periode, filiale, type produit).
4. Ajouter un export CSV/Excel et un job planifie pour envoyer des rapports hebdomadaires.
5. Mettre en place des tests de performance (django-silk ou custom) et documenter.

## Livrables
- Module reporting complet.
- Documentation spec.

## Verifications
- Manual: executer un export sur trois periodes et verifier les chiffres.
- S assurer que le temps de reponse reste < 1.5s pour les requetes principales.

