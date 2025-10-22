# Tache 30 - Notifications omni canal

## Objectif
Creer un service de notifications capable d envoyer des messages via e-mail, WhatsApp (API Cloud), SMS et notifications in-app.

## Contexte
Le front (Tache 20) a besoin d un backend pour alimenter le centre de notifications.

## Pre-requis
- Taches 26 et 28.

## Actions detaillees
1. Definir une table `Notification` avec canal, statut, payload, lien.
2. Implementer des adaptateurs (email via SendGrid ou SMTP, WhatsApp via Meta Cloud API, SMS via alternative gratuite) et documenter les configurations gratuites.
3. Ajouter un job asynchrone (Celery ou RQ) pour envoyer les notifications.
4. Exposer des endpoints pour recuperer les notifications et mettre a jour le statut (lu/non lu).
5. Documenter la configuration dans `docs/ops/notifications.md` (inclure etapes pour creer les comptes fournisseurs, manuelles).

## Livrables
- Service de notifications et endpoints.
- Documentation complete.

## Verifications
- Manual: envoyer une notification test sur chaque canal en environnement de dev (notes dans rapport).
- Tests unitaires pour les adaptateurs (mocks).

