# Tache 17 - Portail client et demandes self-service

## Objectif
Offrir aux clients un espace dedie pour suivre leurs commandes, telecharger documents, chatter et lancer de nouvelles demandes.

## Contexte
`Storefront.tsx` fait office de vitrine. Il faut un veritable portail (login client) avec onglets: Commandes, Factures, Tickets, Collaboration.

## Pre-requis
- Tache 03 (layout) et Tache 15 (catalogue).

## Actions detaillees
1. Ajouter un chemin `/portal` protege pour les clients (utiliser `ProtectedRoute` adapte au role CLIENT).
2. Developper des composants `ClientOrders`, `ClientInvoices`, `ClientRequests`, `ClientTeamChat` dans `src/pages/portal/`.
3. Prevoir un systeme de messages (placeholder) en attendant Tache 29 pour l API.
4. Offrir un bouton `Lancer une commande` redirigeant vers le panier avec pre-remplissage.
5. Ajouter un guide onboarding (checklist) pour les nouveaux clients.

## Livrables
- Portail client accessible via login.
- Documentation `docs/ux/client-portal.md`.

## Verifications
- Manual: tester la connexion avec un compte client fictif.
- Confirmer que les roles non autorises recoivent un message de restriction clair.

