# Tache 09 - Developper un wizard de creation de devis

## Objectif
Simplifier la creation de devis multi lignes avec calculs automatiques et statut associe.

## Contexte
`backend/billing/views.py` offre `QuoteViewSet` mais le frontend n expose aucune interface. Les lignes de devis doivent accepter produit reference ou description libre.

## Actions detaillees
- Concevoir un wizard en plusieurs etapes (client, lignes, conditions, resume) avec sauvegarde brouillon.
- Permettre d ajouter, dupliquer et supprimer des lignes, en calculant sous totaux et taxes.
- Integrer une option d envoi (email ou WhatsApp) et de changement de statut (SENT, ACCEPTED, REJECTED).
- Connecter les actions aux endpoints backend et gerer les retours d erreur.

## Livrables
- Wizard de devis fonctionnel avec validations.
- Documentation utilisateur expliquant le workflow de devis.
