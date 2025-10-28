# Tache 30 - Notifications omnicanal

## Objectif
Mettre en place le service backend de notifications multi-canal (in-app, email, WhatsApp, SMS) pour alimenter le centre front.

## Contexte
Le centre de notifications (Tache 20) attend des données fiables. Nous devons créer une infrastructure notifications basée sur Celery/Redis avec connecteurs modulaires.

## Pre-requis
- Taches 01 a 29.

## Actions detaillees
1. Définir les modèles `Notification`, `NotificationChannel`, `NotificationPreference`, `DeliveryAttempt` et documenter dans `backend/docs/notifications/schema.md`.
2. Implémenter des adaptateurs (email SMTP/SendGrid, WhatsApp Cloud API, SMS provider, push in-app) et configurer Celery tasks pour dispatch.
3. Exposer endpoints REST pour lister/mettre à jour notifications (`/api/notifications/`) et gérer préférences (`/api/notifications/preferences/`).
4. Ajouter intégration au workflow commandes/documents (signals) et instrumentation (logs, retries).
5. Documenter la configuration (clés API, sandbox) dans `docs/ops/notifications.md` + scripts de test.

## Livrables
- Service notifications complet + doc.
- Tests unitaires/integration sur les adaptateurs.

## Verifications
- Exécuter tests automatisés (`manage.py test notifications`).
- Tests manuels via shell/Postman pour déclencher en dev et vérifier stockage/push front.
