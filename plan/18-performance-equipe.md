# Tache 18 - Suivi equipe et performance

## Objectif
Permettre aux utilisateurs de suivre la performance de leurs employes (ventes, satisfaction, productivite) via tableaux et graphiques.

## Contexte
Il existe une page `AdminPanel.tsx`. Il faut enrichir avec onglet Performance et detail par employe.

## Pre-requis
- Tache 13 pour les KPIs globaux.

## Actions detaillees
1. Ajouter une section Performance dans `AdminPanel.tsx` avec onglets (Vue globale, Par employe, Objectifs).
2. Creer un composant `EmployeePerformanceTable` et `PerformanceTrendChart`.
3. Integrer un module de definition d objectifs (CRUD simple) et suivre l avancement.
4. Prevoir des indicateurs d engagement (tickets resolus, commandes traitees).
5. Documenter les formules de calcul dans `docs/metrics/performance.md`.

## Livrables
- Onglet Performance disponible.
- Documentation des indicateurs.

## Verifications
- Manual: selectionner un employe et verifier l affichage (fallback si pas de donnees).
- Controler l export CSV (ajouter si besoin) et documenter le test.

