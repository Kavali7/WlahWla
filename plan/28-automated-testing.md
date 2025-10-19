# Tache 28 - Mettre en place la strategie de tests automatises

## Objectif
Garantir la qualite via des tests unitaires, d integration et end-to-end couvrant les parcours critiques.

## Contexte
Le projet ne contient actuellement aucun test automatises. Les flux sensibles (auth, multi tenant, devis/facture, offline) doivent etre verifies avant chaque release.

## Actions detaillees
- Ajouter une suite de tests backend (pytest ou unittest) couvrant authentification, separation des organisations, workflow devis/facture et sync offline.
- Mettre en place des tests frontend (React Testing Library pour composants, Cypress ou Playwright pour parcours complets).
- Configurer des donnees de fixtures pour accelerer les tests et garantir des resultats deterministes.
- Documenter la commande unique pour lancer tous les tests et integrer un rapport de couverture minimal.

## Livrables
- Dossiers `backend/tests/` et `frontend/tests/` avec suites initiales.
- Rapport de couverture minimal et instructions d execution.
