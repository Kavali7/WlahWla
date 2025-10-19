# Tache 29 - Configurer la CI/CD et les artefacts de build

## Objectif
Automatiser les builds, tests et deploiements pour garantir des livraisons fiables.

## Contexte
Aucun pipeline n est defini. Le projet doit etre installable via un lien, donc il faut un build repeatable (conteneurs, installeur desktop ou script) et un deploy web (admin web).

## Actions detaillees
- Choisir un outil (GitHub Actions, GitLab CI, Azure DevOps) et definir des jobs: lint, tests backend, tests frontend, build frontend, build image Docker.
- Publier les artefacts (image docker, bundle PWA) et preparer un script d installation pour l application desktop (mode PWA ou installeur electron selon strategie).
- Ajouter un pipeline de deploiement automatique vers staging/production (docker compose, Ansible ou Kubernetes selon cible).
- Documenter les secrets et variables CI necessaires ainsi que la procedure de rollback.

## Livrables
- Fichier pipeline versionne (`.github/workflows/...` ou equivalent).
- Instructions pour declencher un deploy manuel ou automatique et gerer les rollbacks.
