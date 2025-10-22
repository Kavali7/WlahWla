# Tache 04 - Bibliotheque visuelle et assets dynamiques

## Objectif
Mettre en place une pipeline d assets (images, icones, videos) inspirant la presentation waohdigital (carrousels, panneaux publicitaires, fonds animes) pour les reutiliser sur tout le site.

## Contexte
Le dossier `public/` contient peu de ressources, aucune convention de nommage et pas de carrousel centralise. WLAHWLA doit presenter differents univers metiers avec des visuels UEMOA de haute qualite.

## Pre-requis
- Tache 01 validee pour les lignes directrices visuelles.

## Actions detaillees
1. Selectionner ou produire (manuel) un set d images hero, cartes publicitaires et icones lineaires; les placer dans `public/assets/brand/` en respectant un schema `usage_nom_resolution.ext`.
2. Mettre en place un composant generique `HeroCarousel` dans `src/components/media/HeroCarousel.tsx` acceptant images, titres, CTA et timers.
3. Ajouter un composant `AdvertisingCard` reutilisable pour les panneaux publicitaires; documenter ses props dans `docs/branding/components-cheatsheet.md`.
4. Optimiser les assets via `npm run optimize:images` (script a ajouter) et conserver les originaux lourds dans `docs/branding/source-assets/` (non deploye).
5. Mettre a jour `vite.config.ts` pour prendre en charge le lazy-loading des images critiques et definir des tailles responsive.

## Livrables
- Nouveaux composants `HeroCarousel` et `AdvertisingCard`.
- Assets deposes dans `public/assets/brand/` avec README d inventaire.
- Script npm `optimize:images` documente.

## Verifications
- Test manuel du carrousel sur desktop/mobile (glissement, pagination).
- Audit Lighthouse axe Performance >= 80 pour la page d accueil apres ajout des assets optimises.

