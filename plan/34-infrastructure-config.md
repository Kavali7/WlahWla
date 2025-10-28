# Tache 34 - Infrastructure & sécurité

## Objectif
Préparer l infrastructure (environnements, secrets, observabilité, sécurité) pour un déploiement UEMOA fiable.

## Contexte
La config docker est basique. Nous devons définir les environnements, gérer les secrets et mettre en place la surveillance et sécurité.

## Pre-requis
- Taches 01 a 33.

## Actions detaillees
1. Définir la matrice environnements (local, staging, production) dans `docs/devops/environments.md` (services, URL, secrets).
2. Mettre à jour `docker-compose.yml` et scripts pour services séparés (frontend, backend, db, redis, worker, queue) et préparer `Dockerfile` prod.
3. Configurer secrets (vault, env chiffrés) et documenter procédures; ajouter validations CI.
4. Mettre en place observabilité (logs centralisés, metrics, uptime) via stack légère (ELK, Loki, Grafana, Healthchecks).
5. Ajouter contrôle sécurité (headers, rate limiting, scans OWASP) et consigner résultats dans `docs/devops/security-audit.md`.

## Livrables
- Config Docker/infra mise à jour, doc environnements, rapport sécurité.

## Verifications
- Test `docker compose up` et santé des services.
- Scan OWASP ZAP et journal des résultats/patchs.
