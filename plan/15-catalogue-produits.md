# Tache 15 - Catalogue produits & inventaire

## Objectif
Refondre les pages produits/inventaire pour gerer les offres WLAHWLA (biens physiques, services, campagnes) avec un design cohérent aux cartes Waoh Digital et des fonctions d upsell/cross sell.

## Contexte
Le rapport montre des cartes offres claires. Nous devons revisiter `Products.tsx` et `Inventory.tsx` pour distinguer produits physiques, services recurrents, packs publicitaires et lier au centre promo (Tache 10).

## Pre-requis
- Taches 01 a 14.

## Actions detaillees
1. Enrichir les types `Product`, `Service`, `CampaignPackage` (`frontend/src/types/catalog.ts`) avec categorie, vertical, price plans, compatibilite UEMOA, assets; documenter dans `docs/domain/catalog.md`.
2. Refonte de `Products.tsx` avec double vue (cards waoh style + tableau) + filtres (type, statut, stock, vertical, responsable); stocker l etat des filtres dans l URL.
3. Ajouter un panneau detail (drawer) avec carrousel images, documents telechargeables, bouton `Ajouter au pack` reliant au pipeline ventes.
4. Adapter `Inventory.tsx` pour afficher stock physique vs capacite service, alertes (low stock), stats (rotation) + quick action `Planifier une campagne`.
5. Connecter le centre publicitaire (Tache 10) pour suggerer des upsells depuis le detail produit; consigner les guidelines visuelles dans `docs/branding/components-cheatsheet.md`.

## Livrables
- Pages `Products.tsx` et `Inventory.tsx` mises a jour.
- Types catalogue et documentation `docs/domain/catalog.md`.

## Verifications
- Tests unitaires sur filtres/sorting (`npm run test catalog`).
- Tests manuels creation/edition produit, verification responsive + persistance des filtres via URL; capture ecran du nouveau layout.
