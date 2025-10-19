# Tache 27 - Durcir la configuration backend pour la production

## Objectif
Adapter la configuration Django pour un deploiement production (securite, base de donnees, fichiers statiques).

## Contexte
`config/settings.py` utilise SQLite, autorise tous les hosts et console email. Aucun stockage statique, securite, ni separation settings dev/prod n est prevu. `docker-compose.yml` suppose Postgres mais les settings ne le lisent pas.

## Actions detaillees
- Introduire une separation des settings (dev, staging, prod) en lisant les variables d environnement (DATABASE_URL, ALLOWED_HOSTS, CSRF_TRUSTED_ORIGINS).
- Configurer le stockage statique (WhiteNoise ou S3) et la gestion des medias.
- Activer les parametres de securite (SECURE_SSL_REDIRECT, cookies HttpOnly/Secure, HSTS, logging).
- Revoir la configuration email pour permettre un envoi SMTP reel et documenter les variables.

## Livrables
- Settings refactores avec documentation des variables requises.
- Verification que la stack Docker utilise la configuration Postgres et sert les fichiers statiques.
