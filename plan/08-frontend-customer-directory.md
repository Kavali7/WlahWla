# Tache 08 - Livrer le carnet clients et leurs fiches

## Objectif
Permettre la consultation et la mise a jour des clients (coordonnees, informations fiscales) directement depuis le frontend.

## Contexte
`backend/billing/models.py` expose `Customer` via `/api/customers/` mais aucune page ne permet aux utilisateurs de gerer ces donnees. Les informations clients sont indispensables pour creer devis et factures conformes.

## Actions detaillees
- Ajouter une vue liste avec recherche par nom, email et NIF.
- Creer un formulaire de creation/edition avec validations (email, numero de telephone, tax_id).
- Afficher une fiche client incluant l historique des devis et factures associes (en lecture seule).
- Gerer les feedbacks UI (toasts, messages d erreur) pour chaque operation.

## Livrables
- Module Client complet integre au routeur.
- Cas de test notes pour creation, modification et suppression.
