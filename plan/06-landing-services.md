# Tache 06 - Landing services et offres

## Objectif
Presenter de maniere claire les offres principales (produits comptables, produits non comptables, prestations, solutions publicitaires) avec des cartes modernes proches de waohdigital.

## Contexte
La section services doit etre repensee pour afficher 4 a 6 cartes, chacune avec icone, puces, CTA specifiques et references sectorielles.

## Pre-requis
- Tache 05 terminee.

## Actions detaillees
1. Inventorier les offres WLAHWLA et les regrouper en categories (Commerce, Services, Solutions digitales, Support administratif).
2. Creer un fichier `src/content/home/services.ts` contenant les cartes (titre, resume, puces, type d offre, route).
3. Mettre a jour `Home.tsx` pour afficher les cartes via le composant `ServiceCard` (a creer si besoin) avec animation hover.
4. Prevoir un CTA global `Explorer toutes les offres` menant au Storefront.
5. Ajouter une mention de la couverture UEMOA et des langues disponibles.

## Livrables
- Donnees `services.ts` et composant `ServiceCard`.
- Section Services finalisee sur la home.

## Verifications
- Manuel: sur mobile, verifier le scroll horizontal ou empilement propre des cartes.
- Controle que chaque CTA pointe vers une page existante (test de navigation).

