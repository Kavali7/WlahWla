# Tache 34 - Configuration infrastructure et securite

## Objectif
Preparer l infrastructure (environnements, secrets, observabilite) pour supporter le deploiement UEMOA avec exigences de securite.

## Contexte
Actuellement, la configuration docker est basique. Il faut preparer les environnements staging/prod, la gestion des secrets et la surveillance.

## Pre-requis
- Taches 25 a 33 completes.

## Actions detaillees
1. Definir la matrice environnements (local, staging, production) et documenter dans `docs/devops/environments.md`.
2. Mettre a jour `docker-compose.yml` et scripts pour separer les services (frontend, backend, db, redis, worker).
3. Configurer la gestion des secrets (Doppler, Vault, ou fichiers `.env` chiffrees) et documenter les procedures.
4. Mettre en place la journalisation centralisee (ELK ou alternative legere) et les alertes (moniteur uptime).
5. Ajouter des controles de securite (headers HTTP, rate limiting) et documenter les tests (OWASP ZAP manuel).

## Livrables
- Fichiers docker et docs mis a jour.
- Rapport securite initial.

## Verifications
- Manual: lancer `docker-compose up` et verifier la sante des services.
- Executer un scan basique OWASP ZAP et noter les resultats.

