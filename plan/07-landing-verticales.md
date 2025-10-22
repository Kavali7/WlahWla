# Tache 07 - Landing verticales et cas d usage

## Objectif
Introduire une section dediee aux verticales (comptabilite, commerce detail, prestations terrain, franchises) avec des contenus adaptes par secteur et des boutons vers des pages profondes.

## Contexte
Pour se differencier, WLAHWLA doit parler a plusieurs industries. Cette section doit reprendre la logique waohdigital (bloc par vertical, icone, puces, CTA).

## Pre-requis
- Tache 06 validee.

## Actions detaillees
1. Identifier quatre verticales prioritaires et rediger les benefices propres (manuel, en coordination marketing).
2. Creer `src/pages/verticals/` avec un composant generique `VerticalPage.tsx` parameterisable.
3. Ajouter dans `src/content/home/verticals.ts` la liste des verticales pour la section d accueil.
4. Configurer le routage (`/verticals/:slug`) et assurer le pre-render via react-router.
5. Ajouter un bandeau `Demandez une demo` en bas de chaque page verticale.

## Livrables
- Section verticales sur la home et pages associees (`/verticals/*`).
- Contenu markdown ou JSON pour chaque vertical dans `content/verticals`.

## Verifications
- Navigation testee manuellement pour chaque slug.
- Mesurer le temps de chargement des pages verticales (Lighthouse) et documenter dans le rapport.

