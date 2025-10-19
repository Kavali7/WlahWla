# Tache 21 - Automatiser la reconciliation des paiements

## Objectif
Recalculer automatiquement le solde de chaque facture lors de l enregistrement des paiements afin de connaitre le total impaye.

## Contexte
`backend/billing/views.py` expose `PaymentViewSet` sans validation ni mise a jour du statut facture. Les rapports affichent `unpaid_total` mais aucune logique ne le calcule.

## Actions detaillees
- Ajouter des validations serializer pour interdire les montants negatifs ou superieurs au reste du du.
- Mettre a jour le statut de la facture (PARTIALLY_PAID, PAID) apres chaque paiement.
- Calculer et stocker le total encaisse et le reste a payer (champs caches ou proprietes).
- Rafraichir l endpoint `/api/reports/overview` pour retourner un `unpaid_total` exact.

## Livrables
- Paiements verifies et factures mises a jour automatiquement.
- Tests unitaires sur les cas partiels et complets.
