# Tache 25 - Modèle de données unifié

## Objectif
Refondre le schéma Django pour supporter l’ensemble des modules WLAHWLA (commerce, facturation, campagnes, services, multi filiales, performance).

## Contexte
Les modèles actuels héritent du starter locatif. Nous devons aligner le backend sur la vision produit décrite dans les tâches frontend et le rapport waohdigital.

## Pre-requis
- Taches 01 a 24 (spécifications fonctionnelles).

## Actions detaillees
1. Cartographier le schéma existant et les besoins (entités: Product, Service, Campaign, Branch, Lead, Notification, Performance) et consigner dans `backend/docs/schema-review.md`.
2. Concevoir le modèle cible (diagramme ER) couvrant : organisations + branches, produits/services, pipeline ventes, commandes, campagnes publicitaires, documents, notifications, métriques.
3. Implémenter/adapter les modèles Django (nouvelles apps si besoin) avec migrations, signaux nécessaires et validations.
4. Mettre à jour l admin Django, serializers, factories/tests; prévoir fixtures de démo cohérentes avec la landing.
5. Documenter le schéma final dans `backend/docs/schema.md` (diagramme, champs clés) et s assurer de la rétrocompatibilité des données.

## Livrables
- Modèles/migrations à jour + doc schéma.
- Admin/fixtures alignés.

## Verifications
- Tests backend (`python manage.py test`), y compris nouveaux tests sur les relations.
- Vérifier via Django admin et scripts (`python manage.py shell`) que les entités s instancient correctement.
