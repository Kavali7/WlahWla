# Tache 35 - CI/CD et qualite continue

## Objectif
Mettre en place une pipeline CI/CD robuste avec tests, lint, build, scans et deploiement automatise.

## Contexte
Le depot manque de pipeline complet. Besoin de workflows GitHub Actions ou GitLab.

## Pre-requis
- Tache 34.

## Actions detaillees
1. Creer des workflows CI (frontend, backend) avec lint, tests, build.
2. Ajouter un job d analyse statique (SonarCloud ou CodeQL) et un audit npm/yarn.
3. Configurer un pipeline CD vers staging (Docker registry + VPS ou plateforme PaaS) et documenter les secrets necessaires.
4. Ajouter des badges de statut dans le README.
5. Mettre en place des regles de protection de branche (manuel via plateforme) et consigner les etapes.

## Livrables
- Workflows CI/CD dans `.github/workflows/`.
- Documentation `docs/devops/ci-cd.md`.

## Verifications
- Manual: declencher une pipeline sur branche de test et capturer le resultat.
- Verifier que les tests se lancent automatiquement sur chaque PR.

