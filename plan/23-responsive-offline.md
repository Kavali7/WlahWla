# Tache 23 - Responsive & expérience offline

## Objectif
Assurer une excellente expérience mobile/tablette et préparer le mode offline (PWA) pour les équipes terrain.

## Contexte
Le site doit rester fluide et disponible même avec une connectivité limitée. Nous devons auditer toutes les pages, ajuster les grilles, et mettre en place la PWA (manifest, service worker, caches).

## Pre-requis
- Taches 01 a 22.

## Actions detaillees
1. Réaliser un audit complet responsive (Chrome DevTools, iOS/Android) et consigner les points dans `docs/qa/responsive-audit.md` (captures + checkliste).
2. Ajuster les layouts (Home, Dashboard, Portal, Admin, Documents) en utilisant Tailwind breakpoints et un design mobile-first (cartes stackées, menus accordéon, CTA visibles).
3. Implémenter `manifest.json`, `service-worker.ts` (Workbox) et config Vite pour activer PWA; gérer icônes/app name.
4. Mettre en cache assets critiques, fallback offline pour pages clés (Home, Dashboard, Pipeline) et messages d’erreur adaptés.
5. Documenter la stratégie offline (sync différée, limites) dans `docs/ops/offline-mode.md` et consigner veille/maintenance PWA.

## Livrables
- Manifest + service worker opérationnels.
- Rapport responsive + doc offline.

## Verifications
- Audit Lighthouse PWA >= 80 et Accessibilité > 90; consigner scores.
- Tests manuels : mode avion sur mobile (app installée) + validation dégradée (affichage message offline).
