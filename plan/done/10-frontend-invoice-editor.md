# Tache 10 - Mettre en place l editeur de factures avec totaux dynamiques

## Objectif
Permettre la creation et la modification de factures conformes, liees eventuellement a un devis, avec calculs TVA et echanges clients.

## Contexte
`backend/billing/models.py` inclut `Invoice` et `InvoiceLine` mais aucune interface n est fournie. Les utilisateurs doivent visualiser les lignes, appliquer la TVA, fixer les dates et generer le PDF.

## Actions detaillees
- Developper un formulaire complet (client, numero, dates, devise, statut) avec validation server side et client.
- Autoriser l import de lignes depuis un devis accepte et la modification manuelle.
- Calculer sous total, taxes et total TTC en temps reel, en affichant les valeurs dans la vue.
- Offrir des actions: generer PDF, envoyer par email (endpoint `/api/invoices/{id}/send_email`), changer de statut.

## Livrables
- Ecran facture pret pour la production.
- Liste des tests fonctionnels (creation, edition, envoi email).
