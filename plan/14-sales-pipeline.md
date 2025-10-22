# Tache 14 - Pipeline ventes et commandes

## Objectif
Fournir une vue pipeline pour suivre les opportunites et commandes (prospects, devis, commandes en preparation, livraisons) avec un UX moderne.

## Contexte
La page `QuoteBuilder.tsx` gere une partie devis. Nous devons creer une vue Kanban/pipeline dediee pour les commerciaux.

## Pre-requis
- Tache 13, car le pipeline doit se connecter aux memes filtres.

## Actions detaillees
1. Concevoir un composant `SalesPipelineBoard` (colonnes dynamiques) dans `src/components/sales/`.
2. Reutiliser les donnees existantes (quotes, invoices) et definir un mapping etat -> colonne.
3. Ajouter des actions rapides (convertir en commande, contacter client, generer facture) via menus contextuels.
4. Permettre le drag-and-drop (utiliser `react-beautiful-dnd`) et enregistrer le mouvement via API (stub).
5. Ajouter une vue liste alternative pour les ecrans mobiles.

## Livrables
- Nouvelle page `src/pages/sales/Pipeline.tsx` linkee depuis la nav.
- Support des interactions drag-drop (avec fallback).

## Verifications
- Manual: tester le drag-and-drop avec la souris et au clavier si possible.
- Ajouter des tests unitaires pour le mapping etats dans `src/components/sales/__tests__/pipeline.test.tsx`.

