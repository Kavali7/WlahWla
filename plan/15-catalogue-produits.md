# Tache 15 - Catalogue produits et stocks

## Objectif
Adapter l interface d inventaire pour couvrir produits comptables, non comptables et services, avec fiches detaillees et options d upsell.

## Contexte
`Inventory.tsx` et `Products.tsx` gerent des produits generiques. Besoin d intitules, de tags par vertical, de differenciation produits/services.

## Pre-requis
- Taches 06 et 07 pour la classification.

## Actions detaillees
1. Etendre les modeles front (`Product`, `Service`) pour inclure categorie, segment, compatibilite UEMOA.
2. Revoir `Products.tsx` pour ajouter des filtres (type, statut, stock, employe responsable) et un layout cartes + table.
3. Integrer un panel lateral detaille avec carrousel images, documents indispensables, bouton `Ajouter au pack`.
4. Adapter `Inventory.tsx` pour suivre le stock physique vs stock service (capacite).
5. Ajouter une integration vers le centre publicitaire (Tache 10) pour mettre en avant certains items.

## Livrables
- Pages produits/inventaire mises a jour.
- Definitions types dans `src/types/catalog.ts`.

## Verifications
- Manual: tester la creation/edition d un produit differencie (avec validations).
- Verifier que les filtres se conservent via URL query (test navigation).

