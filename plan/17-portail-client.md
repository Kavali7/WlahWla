# Tache 17 - Portail client self-service

## Objectif
Créer un espace client authentifié permettant de suivre commandes, factures, campagnes, tickets et ressources, avec un UI cohérent (cartes arrondies, CTA clairs) et une expérience multi-module.

## Contexte
Le rapport montre l importance d offrir un accès direct. WLAHWLA doit distinguer l’administration interne et l’interface client (role CLIENT) avec un layout adapté.

## Pre-requis
- Taches 01 a 16 (navigation, catalogue, pipeline).

## Actions detaillees
1. Concevoir l’information architecture du portail (Tableau de bord client, Commandes, Factures, Campagnes, Support) et documenter dans `docs/ux/client-portal.md`.
2. Mettre en place la route protégée `/portal` avec `ClientLayout` (header minimal, menu lateral, CTA WhatsApp) en utilisant `react-router` et `useAuth`.
3. Developper les pages `ClientOrders`, `ClientInvoices`, `ClientCampaigns`, `ClientSupport` dans `frontend/src/pages/portal/` (cards, tables, timeline) et partager les composants existants (`KpiCard`, `AdvertisingCard`).
4. Intégrer un module de demandes (`NewRequestModal`) avec pièces jointes, assignation interne, et un fil de discussion (stub) en attendant API (Tache 29/30).
5. Ajouter une checklist onboarding (progression) et un bloc CTA `Découvrir une nouvelle fonctionnalité` alimenté par `frontend/src/content/portal/tips.ts`; consigner les retours clients dans `docs/ops/client-success.md`.

## Livrables
- Portail client (`/portal`) avec navigation et pages principales.
- Documentation `docs/ux/client-portal.md` et `docs/ops/client-success.md`.

## Verifications
- Test manual : connexion via compte role CLIENT, vérification restrictions pour rôles non autorisés.
- Tests automatisés pour les protections de route et l’affichage des données (unitaires + e2e si possible), et audit accessibilité sur les principales pages du portail.
