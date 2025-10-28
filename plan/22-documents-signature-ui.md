# Tache 22 - Documents & signature numérique (UI)

## Objectif
Construire l interface de gestion documents (templates, génération, signature) avec un design premium et des intégrations vers la signature numérique.

## Contexte
Les templates existent côté backend de manière limitée. Nous devons fournir une UI simple, accessible et cohérente avec WLAHWLA pour gérer contrats, devis, rapports et piloter les signatures.

## Pre-requis
- Taches 01 a 21.

## Actions detaillees
1. Définir les types de documents (devis, contrat, accord service, rapport) et les workflows (brouillon, envoyé, signé); documenter dans `docs/legal/signature.md`.
2. Créer les pages `Templates.tsx`, `TemplateBuilder.tsx`, `SignatureRequests.tsx` dans `frontend/src/pages/documents/` avec recherche, tags, filtres par organisation.
3. Développer un builder (drag/drop champs) ou un éditeur paramétrable (placeholders moustaches) + prévisualisation PDF (via `pdfjs`/iframe) pour vérifier le rendu.
4. Intégrer un module de suivi signatures (`SignatureTimeline`) avec statuts par signataire, rappels (liens WhatsApp/email) et connexion future à un prestataire (DocuSeal/LibeSign) via API (Tache 32).
5. Brancher le centre notifications (Tache 20) et consigner captures/guide dans `docs/ops/documents.md`.

## Livrables
- UI documents complète + builder + suivi signatures.
- Documentation `docs/legal/signature.md` et `docs/ops/documents.md`.

## Verifications
- Tests manuels : créer un template, générer un document, simuler signature; vérifier accessibilité (contraste, focus).
- Tests unitaires sur les helpers (formatage placeholders) et e2e (si possible) sur un flux complet.
