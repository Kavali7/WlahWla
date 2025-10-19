# Tache 05 - Enrichir le tableau de bord et ses filtres

## Objectif
Afficher des indicateurs fiables et filtrables sur le tableau de bord afin de donner une vision claire des ventes et finances.

## Contexte
`frontend/src/pages/Dashboard.tsx` consomme des endpoints qui retournent aujourd hui des placeholders (`backend/reports/views.py`). Il n y a ni etat de chargement ni gestion d erreurs, et les graphiques n acceptent aucun filtre de periode.

## Actions detaillees
- Introduire des placeholders visuels pour les chargements et les erreurs sur chaque card.
- Ajouter des filtres (periode, organisation, canal de vente) et recharger les donnees en consequence.
- Harmoniser les formats numeriques (monnaie, pourcentages) via un utilitaire dedie.
- Prevoir un export (CSV ou impression) des indicateurs cles.

## Livrables
- Dashboard interactif avec filtres fonctionnels.
- Documentation des sources de donnees et du format des reponses attendues.
