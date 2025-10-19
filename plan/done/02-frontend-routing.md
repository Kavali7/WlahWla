# Tache 02 - Mettre en place React Router et le decoupage des routes

## Objectif
Structurer les routes du frontend avec React Router, appliquer des garde-fous d authentification et charger les pages en code split.

## Contexte
`frontend/src/App.tsx` gere la navigation via `window.location.hash` et ne controle ni l authentification ni la granularite des modules. Cette approche rend impossible la gestion des sous routes (ex: details de facture) et la redirection apres login.

## Actions detaillees
- Installer React Router et declarer les routes Dashboard, Storefront, Admin ainsi que des sous routes pour produits, clients, factures et parametres.
- Introduire un composant `ProtectedRoute` qui verifie la presence du jeton d authentification avant de rendre les sections internes.
- Activer le chargement asynchrone des pages volumineuses (lazy + Suspense) pour ameliorer le temps de chargement initial.
- Prevoir une route 404 et un ecran de fallback pour les chargements.

## Livrables
- Configuration de routing centralisee (ex: `frontend/src/router.tsx`).
- Mise a jour de `App.tsx` pour utiliser le routeur.
- Documentation courte expliquant l ajout de routes protegees.
