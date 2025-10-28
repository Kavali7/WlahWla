# Tache 36 - Go-live & migration

## Objectif
Finaliser toutes les étapes pour le lancement public de WLAHWLA (migration données, formation, communication, surveillance).

## Contexte
Une fois toutes les taches précédentes terminées, il faut orchestrer migration, déploiement et suivi poste-lancement.

## Pre-requis
- Taches 01 a 35.

## Actions detaillees
1. Elaborer le plan de migration (`docs/devops/migration-plan.md`) : import données, création comptes initiaux, mapping prix.
2. Préparer guides utilisateurs (admin, employé, client) + kit communication (mail, réseaux) dans `docs/launch/`.
3. Répéter le déploiement (dry run) et consigner timings; vérifier pipelines/CD (Tache 35).
4. Mettre en ligne (DNS/SSL, déploiement final) et exécuter checklist de validation fonctionnelle.
5. Organiser période de surveillance (uptime, logs, support) et consigner incidents dans `docs/launch/post-mortem.md`.

## Livrables
- Plan migration, guides, kit communication, rapport répétition.

## Verifications
- Tests manuels post-production (connexion comptes clés, flux critiques).
- Suivi indicateurs (uptime, erreurs) 24 premières heures, archiver logs.
