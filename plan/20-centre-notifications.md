# Tache 20 - Centre de notifications & timeline

## Objectif
Créer un centre de notifications moderne (in-app, email, WhatsApp) avec timeline d activité, paramètres par canal et intégration aux modules WLAHWLA.

## Contexte
L analyse waohdigital souligne l importance des CTA rapels (WhatsApp). Nous devons proposer un panneau cloche + timeline cohérent avec notre UI, et préparer l intégration backend (webhooks, Celery).

## Pre-requis
- Taches 01 a 19.

## Actions detaillees
1. Documenter les types de notifications/events (pipelines, factures, campagnes, support) et les niveaux (info, alerte) dans `docs/domain/notifications.md`; définir les templates de messages.
2. Développer `NotificationCenter` dans `frontend/src/components/notifications/NotificationCenter.tsx` avec onglets filtrants, recherche, timeline verticale et actions (marquer lu, rappeler via WhatsApp).
3. Mettre en place toasts contextuels (`useToast`) et préférences utilisateur dans `frontend/src/pages/settings/Notifications.tsx` (toggles par canal, plages horaires).
4. Alimenter via mock store `frontend/src/mocks/notifications.ts` puis connecter aux endpoints backend (Tache 30) incluant websocket/polling; gérer persistence (API + localStorage fallback).
5. Ajouter instrumentation (tracking event) et documenter la procédure tests dans `docs/ux/notifications.md` + consigner captures.

## Livrables
- Composants `NotificationCenter`, page préférences, documentation.
- Store/mocks + intégration future backend.

## Verifications
- Tests unitaires sur reducer/affichage notifications.
- Tests manuels : simulation flux (commande créée, facture due) + vérification accessibilité (focus trap, ARIA) et persistance des préférences.
