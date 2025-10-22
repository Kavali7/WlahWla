# Tache 32 - Automatisation documents et generation PDF

## Objectif
Automatiser la generation de documents (devis, factures, contrats) avec templating, insertion de logos clients et integration signature.

## Contexte
Les templates front existent (Tache 22). Il faut un service backend pour produire PDF et suivre les generations.

## Pre-requis
- Taches 22 et 25.

## Actions detaillees
1. Ajouter un service (ex: `DocumentGenerator`) utilisant `weasyprint` ou `ReportLab` pour generer des PDF.
2. Connecter aux templates stockes (base de donnees ou filesystem) et permettre l injection de logos/variables.
3. Mettre en place des webhooks pour envoyer les documents au centre de notifications (Tache 30).
4. Stocker l historique des generations et fournir un endpoint pour telecharger.
5. Documenter le process dans `docs/legal/document-automation.md` y compris les limites legales.

## Livrables
- Service de generation PDF.
- Documentation juridique et technique.

## Verifications
- Manual: generer un devis test et verifier rendu.
- S assurer que les logos customises s affichent correctement.

