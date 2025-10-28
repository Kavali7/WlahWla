# Tache 31 - Reporting & analytics

## Objectif
Fournir un module reporting performant reliant ventes, facturation, campagnes, services et performances équipes, avec exports programmables.

## Contexte
Les dashboards (Taches 13, 18) ont besoin d APIs analytiques structurées. Nous devons consolider les données, optimiser les requêtes et fournir des exports.

## Pre-requis
- Taches 01 a 30.

## Actions detaillees
1. Définir les KPIs (revenu, marge, conversions, SLA services, campagnes) et consigner dans `backend/docs/metrics/reporting-spec.md`.
2. Construire une couche `reporting` (ORM + SQL raw/vues matérialisées) pour calculer ces métriques efficacement; planifier les agrégations (journalière, hebdomadaire).
3. Exposer endpoints `/api/reporting/overview`, `/api/reporting/performance`, `/api/reporting/campaigns` avec filtres (période, organisation, filiale, vertical).
4. Ajouter exports CSV/Excel, scheduler Celery pour rapports planifiés (email) et logs d exécution.
5. Mettre en place tests de performance et documentation (utilisation, limites) dans `docs/ops/reporting.md`.

## Livrables
- API reporting complète + exports.
- Documentation `reporting-spec.md` & `ops/reporting.md`.

## Verifications
- Tests automatisés (unitaires, intégration) + benchmarks (<1.5s sur requêtes clés).
- Tests manuels : générer rapport multi périodes et comparaison données cross modules.
