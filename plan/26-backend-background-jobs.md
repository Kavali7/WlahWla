# Tache 26 - Mettre en place les jobs Celery et notifications

## Objectif
Externaliser les traitements lourds (PDF, emails, synchronisations) dans Celery pour garantir la reactivite de l API.

## Contexte
`docker-compose.yml` demarre worker et beat mais aucune tache Celery n est definie. L envoi d email (`billing/views.py::send_invoice_email_view`) s effectue en synchrone.

## Actions detaillees
- Configurer un module de taches (ex: `backend/billing/tasks.py`) avec generation PDF, envoi email, rappels impayes.
- Prevoir une file par type de tache et un scheduled job (beat) pour relancer les factures en retard.
- Injecter l appel aux taches dans les vues (send_invoice_email, sync offline).
- Mettre en place un monitoring minimal (Flower ou logs struktures) pour suivre l execution.

## Livrables
- Taches Celery operationnelles et documentees.
- Tests unitaires utilisant `CELERY_TASK_ALWAYS_EAGER` pour verifier l orchestration.
