# Tache 33 - Integrations externes (paiement, CRM, analytics)

## Objectif
Connecter WLAHWLA a des services tiers necessaires (paiements UEMOA, CRM, analytics marketing) en priorisant les options gratuites ou freemium.

## Contexte
Pour apporter plus que waohdigital, il faut proposer des connecteurs (Orange Money, Wave, HubSpot, Matomo).

## Pre-requis
- Taches 27, 29 et 31.

## Actions detaillees
1. Lister les integrations prioritaires et valider avec business (manuel) dans `docs/integrations/integration-roadmap.md`.
2. Implementer une passerelle paiement modulable (ex: API Paydunya, CinetPay) en commencant par sandbox gratuite.
3. Ajouter un connecteur CRM (webhooks vers HubSpot/Zoho) configurable par compte.
4. Mettre en place Matomo ou Plausible self-hosted pour analytics marketing.
5. Documenter chaque configuration pas a pas avec captures ecran et URLs de creation de compte.

## Livrables
- Code d integration dans `backend/integrations/`.
- Documentation detaillee.

## Verifications
- Manual: realiser un paiement sandbox et verifier la remontee dans le dashboard.
- Tester l envoi d un lead vers le CRM externe.

