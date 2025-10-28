# Tache 35 - CI/CD & qualité continue

## Objectif
Mettre en place une pipeline CI/CD fiable (tests, lint, build, scans, déploiement) pour garantir la qualité du projet jusqu à la production.

## Contexte
Aucune pipeline complète n est encore configurée. Nous devons automatiser les validations front/back et préparer la livraison continue.

## Pre-requis
- Taches 01 a 34.

## Actions detaillees
1. Créer des workflows GitHub Actions (ou GitLab CI) pour le frontend et le backend : lint, tests, build, coverage.
2. Ajouter analyse statique (CodeQL/SonarCloud) et audits dépendances (npm audit, pip-audit).
3. Configurer pipeline CD vers staging (build Docker, push registry, déploiement) et documenter secrets/review apps.
4. Ajouter badges de statut dans README et doc sur stratégie branches/protections.
5. Documenter pipeline dans `docs/devops/ci-cd.md` et définir checklists release.

## Livrables
- Workflows CI/CD, documentation, badges.

## Verifications
- Lancer pipeline sur branche test et analyser résultats.
- Vérifier exécution automatique sur PR + blocking status checks.
