# Tache 25 - Gerer les templates documents et le rendu PDF

## Objectif
Permettre la personnalisation complete des templates de devis/factures et fiabiliser la generation PDF.

## Contexte
`backend/billing/models.py` expose `DocumentTemplate` mais aucune API ni interface ne permet de gerer les templates. `billing/services.py` suppose que `tmpl.html` est fourni manuellement.

## Actions detaillees
- Creer un viewset REST pour les templates (liste, creation, set default) avec permissions adequates.
- Ajouter des validations sur le HTML/CSS (taille, variables disponibles, securite).
- Mettre en place des tests pour la generation PDF (Weasyprint) et la gestion des polices statiques.
- Preparer un template par defaut conforme UEMOA (logo, champs obligatoires, mentions legales).

## Livrables
- Endpoints et tests pour DocumentTemplate.
- Documentation des balises disponibles dans les templates.
