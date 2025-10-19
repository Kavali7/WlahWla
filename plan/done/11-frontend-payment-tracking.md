# Tache 11 - Suivre les paiements et le statut des factures

## Objectif
Tracer les encaissements par facture et recalculer automatiquement les soldes pour connaitre les impayes.

## Contexte
Le frontend n expose aucune interface pour `PaymentViewSet`. Le dashboard affiche `unpaid_total` mais la valeur reste fausse sans suivi des paiements.

## Actions detaillees
- Ajouter un panneau detail facture avec timeline des paiements.
- Creer un formulaire pour enregistrer un paiement (montant, mode, date) et valider la coherence (pas de montant negatif ni de depassement).
- Mettre a jour l affichage du statut facture (DRAFT, SENT, PARTIALLY_PAID, PAID, CANCELLED) en fonction du backend.
- Prevoir un export simple (CSV) des paiements pour rapprochement comptable.

## Livrables
- Interface de suivi des paiements liee aux factures.
- Tests manuels documentes (paiement partiel, complet, annulation).
