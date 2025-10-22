# Tache 20 - Centre notifications et timeline

## Objectif
Introduire un centre de notifications multi-canal (app, email, WhatsApp) avec timeline d activite pour suivre les evenements majeurs.

## Contexte
Actuellement, les notifications sont rudimentaires. Nous voulons un panneau a la waohdigital (cloche + timeline) avec filtres par type.

## Pre-requis
- Tache 13 et Tache 19 pour disposer des structures UI.

## Actions detaillees
1. Creer `src/components/notifications/NotificationCenter.tsx` avec onglets (Tous, Commandes, Paiements, Support).
2. Ajouter une timeline `ActivityTimeline` pour afficher les derniers evenements (modifications c-panel, nouvelles commandes).
3. Connecter a un mock store `src/mocks/notifications.ts` en attendant l integration backend (Tache 30).
4. Mettre en place un systeme de toasts pour les notifications instantanees.
5. Ajouter des controles pour marquer comme lu, filtrer par canal, configurer les preferences.

## Livrables
- Centre de notifications operationnel.
- Documentation `docs/ux/notifications.md`.

## Verifications
- Manual: simuler diverses notifications et verifier la timeline.
- Tester la persistence des preferences (localStorage) et noter le resultat.

