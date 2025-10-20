# Tache 14 - Construire l ecran de parametres organisation

## Objectif
Donner aux admins la possibilite de configurer les informations legales et fiscales de leur organisation pour respecter la reglementation UEMOA.

## Contexte
`backend/core/models.py` comporte des champs obligatoires (trade_register, tax_id, default_tax_rate, whatsapp_number) mais aucun formulaire ne permet de les modifier cote frontend. Ceci bloque les validations de factures.

## Actions detaillees
- Creer un formulaire detaille (identite, adresse, numero fiscal, options TVA, WhatsApp) pre-rempli par l API.
- Valider les formats (tax_id, whatsapp_number) avant envoi.
- Afficher des alertes si les champs requis par la compliance UEMOA sont incomplets.
- Integrer des toggles pour activer/desactiver la TVA et choisir le taux par defaut.

## Livrables
- Page Parametres operationnelle.
- Guide rapide pour saisir les informations legales.
