# Tache 15 - Finaliser l experience PWA et la synchronisation hors ligne

## Objectif
Garantir une experience hors ligne stable avec installation PWA sur desktop et mobile et une synchronisation fiable une fois la connexion retablie.

## Contexte
Le service worker est reference depuis `Dashboard.tsx` avec le chemin `/public/service-worker.js`, ce qui est incorrect dans Vite. Le composant `SyncStatus` n affiche que le statut reseau sans suivi de la file IndexedDB.

## Actions detaillees
- Exposer correctement le service worker depuis `frontend/public/service-worker.js` (registre `/service-worker.js`) et verifier l installation PWA (manifest complet).
- Ajouter un indicateur de file hors ligne (nombre d operations, derniere tentative) dans `frontend/src/components/SyncStatus.tsx`.
- Tester les scenarii offline: creation produit hors ligne, re-synchro via `/api/sync`.
- Documenter les bonnes pratiques d utilisation hors ligne pour les utilisateurs.

## Livrables
- Service worker et manifest valides.
- Tests manuels hors ligne documentes.
