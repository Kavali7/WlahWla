# Tache 09 - Landing a propos et ADN Groxpeak

## Objectif
Construire une section `A propos` mettant en avant Groxpeak Agence, l equipe, la couverture UEMOA, les valeurs et l historique, tout en restant coherent avec la charte.

## Contexte
La page A propos doit rappeler l accueil de waohdigital tout en integrant nos specificites (multi-pays, innovation, support). Elle servira aussi a rediriger vers des postes vacants.

## Pre-requis
- Tache 01 pour le storytelling.

## Actions detaillees
1. Rediger le contenu narratif (vision, mission, valeurs) et valider avec la direction (manuel).
2. Creer `src/pages/About.tsx` avec sections: introduction, chronologie, equipe (cards), implantations UEMOA (carte ou liste).
3. Ajouter un composant `ExperienceBadge` (annees d expertise) similaire a waohdigital.
4. Lier le bouton `Rejoindre l equipe` vers un formulaire Typeform ou Notion (lien a confirmer).
5. Mettre a jour la navigation pour pointer vers `/about` et integrer un breadcrumb dans le layout secondaire.

## Livrables
- Page About fonctionnelle.
- Contenus places dans `src/content/about/` (texte, stats, timeline).

## Verifications
- Test manuel: verifier l affichage sur mobile et la coherence des dates.
- S assurer que tous les liens externes s ouvrent dans un nouvel onglet avec `rel="noopener"`.

