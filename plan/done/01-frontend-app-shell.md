# Tache 01 - Consolider layout responsif et design system

## Objectif
Mettre en place un shell d application responsive et coherent afin que toutes les pages reutilisent les memes composants d interface.

## Contexte
Le composant `frontend/src/App.tsx` contient une navigation minimale et aucune grille responsive. Le fichier `frontend/src/index.css` ne definit que quelques classes utilitaires. Sans structure globale il est difficile de garantir un rendu propre sur mobile et desktop.

## Actions detaillees
- Introduire un composant Layout (header, barre laterale optionnelle, conteneur principal) partage par les pages Dashboard, AdminPanel et Storefront.
- Decliner une palette, une echelle de typographie et des classes utilitaires Tailwind dans `frontend/tailwind.config.ts` pour assurer la coherence visuelle.
- Ajouter des composants de base (boutons, badges, tableaux, cartes) dans `frontend/src/components` pour eviter la duplication.
- Verifier le rendu responsive (mobile, tablette, desktop) en utilisant des breakpoints Tailwind et des tests manuels sur petites largeurs.

## Livrables
- Nouveaux composants de layout documentes.
- Mise a jour de `App.tsx` et des pages existantes pour utiliser le shell commun.
- Captures ou description des verifications responsive realisees.
