# Tache 27 - Catalogue et moteur de tarification

## Objectif
Fournir un moteur de tarification flexible capable de gerer produits, services, packs et remises selon la filiale ou le segment.

## Contexte
Le backend doit supporter le front (Tache 15). Cela implique des tables supplementaires et des regles de calcul.

## Pre-requis
- Tache 25.

## Actions detaillees
1. Ajouter des models `PriceList`, `DiscountRule`, `BundledOffer`.
2. Creer des services/metiers pour calculer le prix final selon les conditions (quantite, filiale, canal).
3. Exposer des endpoints REST (`/api/catalog/pricing-preview`) pour que le front affiche les totaux en temps reel.
4. Ajouter des tests unitaires et d integration.
5. Documenter les scenarios dans `docs/catalog/pricing-engine.md`.

## Livrables
- Moteur de tarification operationnel.
- Documentation technique.

## Verifications
- Manual: tester l endpoint via `httpie` ou `curl` avec plusieurs scenarios.
- Verifier la coherence des montants avec les besoins marketing.

