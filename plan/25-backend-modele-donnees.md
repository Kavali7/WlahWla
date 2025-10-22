# Tache 25 - Modele de donnees commercial unifie

## Objectif
Adapter les modeles backend pour couvrir produits, services, campagnes publicitaires, filiales et performances employes.

## Contexte
Les models actuels sont orientes gestion locative. Il faut les refactorer pour le domaine commercial multi-offres.

## Pre-requis
- Documentation fonctionnelle issue des taches frontend (15-22).

## Actions detaillees
1. Cartographier les entites existantes (`Product`, `Service`, `Order`, `Organization`, etc.) et identifier les gaps.
2. Ajouter/adapter les models (par ex. `ServicePackage`, `CampaignSlot`, `Branch`, `EmployeePerformance`).
3. Mettre a jour les migrations et ecrire des migrations de donnees si necessaire.
4. Documenter le schema mis a jour dans `backend/docs/schema.md` et generer un diagramme ER (outil manuel).
5. Executer `python manage.py makemigrations` puis `python manage.py migrate` en local.

## Livrables
- Models et migrations ajoutes.
- Documentation schema a jour.

## Verifications
- Manual: lancer les tests backend (`pytest` ou `python manage.py test`).
- Verifier qu un superuser voit les nouvelles entites dans l admin Django.

