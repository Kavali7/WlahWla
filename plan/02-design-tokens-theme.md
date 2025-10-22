# Tache 02 - Design tokens et theme global

## Objectif
Traduire la charte definie en Tache 01 dans le systeme de design technique (Tailwind, variables CSS, assets partages) pour garantir une coherence visuelle sur tout le frontend.

## Contexte
`tailwind.config.ts` et `src/index.css` contiennent une palette generique. Les composants n exploitent pas encore des tokens semantiques capables de porter le degrade hero, les cartes publicitaires ou les badges de statut.

## Pre-requis
- Tache 01 finalisee avec palette et typographies valides.

## Actions detaillees
1. Introduire dans `tailwind.config.ts` des tokens `theme.colors` semantiques (primary, secondary, accent, neutral, success, warning) bases sur la nouvelle palette.
2. Ajouter des valeurs pour les ombres, rayons de bordure et espacements derives du playbook (ex: `shadow-elevated`, `rounded-xl`).
3. Creer un fichier `src/theme/tokens.css` qui expose les variables CSS (gradient hero, overlays, couleurs de cartes publicitaires) et l importer dans `main.tsx`.
4. Mettre a jour les composants base (`Button`, `Card`, `Badge`, `Tabs`) pour utiliser ces classes semantiques et documenter les variations dans `docs/branding/components-cheatsheet.md`.
5. Executer `npm run lint` et `npm run typecheck` pour verifier qu aucune regression n est introduite.

## Livrables
- `tailwind.config.ts` et `src/theme/tokens.css` alignes avec la charte.
- `docs/branding/components-cheatsheet.md` contenant exemples et capture Figma (lien).

## Verifications
- Tests manuels sur les pages existantes (Dashboard, Storefront) pour confirmer que les couleurs se mettent bien a jour.
- Rapport de commande `npm run lint` joint dans le rapport de tache si des avertissements apparaissent.

