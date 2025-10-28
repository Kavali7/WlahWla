# Tache 24 - Accessibilité & localisation

## Objectif
Garantir un niveau WCAG 2.1 AA et préparer la localisation FR/EN (puis langues UEMOA) sur l’ensemble du frontend.

## Contexte
Nous devons aligner l expérience sur les standards internationaux et proposer des versions multilingues. Les tokens design sont prêts, il faut vérifier les contrastes, les focus et les textes.

## Pre-requis
- Taches 01 a 23.

## Actions detaillees
1. Intégrer `react-i18next` (ou équivalent) avec structure `frontend/src/i18n/` (fr.json, en.json) et loader lazy; planifier l extension vers autres langues UEMOA.
2. Extraire toutes les chaînes UI vers le système i18n et ajouter un sélecteur langue dans header + sauvegarde (localStorage, user settings).
3. Réaliser un audit accessibilité : labels ARIA, focus, rôles, ordres tab, lecteurs d’écran; consigner résultat dans `docs/qa/accessibility-report.md` avec plan d’action.
4. Ajuster design tokens si besoin (contrastes) et ajouter helper `useFocusRing` + skip links.
5. Documenter procédure d’ajout langue + guidelines accessibilité (capteurs, animations, préférences) dans `docs/ops/i18n-accessibilite.md`.

## Livrables
- Système i18n intégré, switch langue, documentation.
- Rapport accessibilité détaillé avec actions correctives.

## Verifications
- Audit automatisé (axe DevTools, Lighthouse Accessibilité >= 95) + tests manuels NVDA/VoiceOver (au moins navigation principale, formulaires).
- Vérifier chargement dynamique des traductions et fallback (FR par défaut).
