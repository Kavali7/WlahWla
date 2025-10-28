# Tache 32 - Automatisation documents & génération PDF

## Objectif
Créer le service backend de génération de documents (devis, factures, contrats) avec templating dynamique, logos clients et intégration signature.

## Contexte
Le front (Tache 22) fournit l UI. Nous devons produire les PDF côté backend, gérer l historique et l intégration avec la signature numérique.

## Pre-requis
- Taches 01 a 31.

## Actions detaillees
1. Concevoir un service `DocumentGenerator` (WeasyPrint/ReportLab) pour transformer templates HTML + données en PDF, en gérant logos personnalisés et ressources.
2. Intégrer la persistance des templates (BDD ou stockage) avec versioning, variables moustaches et fallback.
3. Ajouter endpoints pour déclencher génération, récupérer l historique, télécharger, re-signer; enregistrer liens vers signature provider.
4. Mettre en place webhooks/tâches Celery pour générer en asynchrone, notifier (Tache 30) et stocker dans `DocumentArchive`.
5. Documenter la solution (limites légales, stockage) dans `docs/legal/document-automation.md` et `docs/ops/documents.md`.

## Livrables
- Service de génération PDF + endpoints/historique.
- Documentation juridique/technique.

## Verifications
- Tests backend (unitaires + intégration) sur la génération (ex: snapshot PDF, diff hash).
- Tests manuels: générer un devis, vérifier rendu, logos personnalisés, lien signature.
