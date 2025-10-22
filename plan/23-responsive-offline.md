# Tache 23 - Responsive, mobile et offline

## Objectif
Garantir une experience fluide sur mobile/tablette et preparer le mode offline (PWA) pour les deplacements sur le terrain.

## Contexte
Certaines pages ne sont pas optimisees. Il faut revisiter le responsive et activer les features PWA.

## Pre-requis
- Taches 05 a 22 completes.

## Actions detaillees
1. Auditer le responsive (Chrome DevTools) et consigner les anomalies dans `docs/qa/responsive-audit.md` (manuel).
2. Ajuster les grids et breakpoints pour Home, Dashboard, Portal, Admin.
3. Ajouter `manifest.json` et `service-worker.ts` (utiliser Workbox) pour la PWA.
4. Mettre en cache les assets critiques et prevoir un fallback offline pour les pages cle.
5. Executer `npm run build` puis `npm run preview` pour tester le PWA sur mobile (manuellement via QR code ou tunnel).

## Livrables
- Manifest et service worker en place.
- Rapport responsive documente.

## Verifications
- Audit Lighthouse categorie PWA >= 80.
- Test manuel: activer mode avion et verifier la page offline.

