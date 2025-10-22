# Tache 24 - Accessibilite et localisation

## Objectif
Assurer l accessibilite (WCAG AA) et preparer la localisation (FR/EN) pour tout le frontend.

## Contexte
Actuellement, peu d attention a ete donnee a l accessibilite. Il faut integrer i18n, labeliser les composants et fournir un switch de langue.

## Pre-requis
- Tache 23.

## Actions detaillees
1. Ajouter `react-i18next` et structurer les fichiers de traduction dans `src/i18n/`.
2. Parcourir les composants et remplacer les textes durs par des keys de traduction.
3. Ajouter des etiquettes aria, roles et gerer le focus visible.
4. Introduire un widget de changement de langue (FR/EN) dans la nav.
5. Executer `npm run lint -- --fix` et un audit axe DevTools pour les anomalies d accessibilite.

## Livrables
- Config i18n en place.
- Rapport accessibilite `docs/qa/accessibility-report.md`.

## Verifications
- Manual: utiliser VoiceOver/NVDA (au minimum simulation) et consigner les resultats.
- Verifier que les traductions chargent dynamiquement selon la langue.

