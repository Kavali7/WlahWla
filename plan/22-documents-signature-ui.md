# Tache 22 - Documents et signature numerique (UI)

## Objectif
Mettre en place une experience utilisateur pour la generation, la personnalisation et la signature numerique de documents (contrats, devis).

## Contexte
Le backend gere partiellement les templates. Il faut une UI moderne similaire a waohdigital pour configurer les documents et suivre les signatures.

## Pre-requis
- Tache 15 (catalogue) et Tache 21 (multi-org).

## Actions detaillees
1. Creer `src/pages/documents/Templates.tsx` avec listing, recherche, tags.
2. Ajouter `TemplateBuilder` pour editer champs dynamiques (ex: moustaches) et previsualisation PDF.
3. Integrer un module de signature (placeholder) affichant statut par signataire.
4. Preparer la connexion a un service de signature gratuit (DocuSeal, HelloSign test) et documenter les pre-requis dans `docs/legal/signature.md`.
5. Ajouter notifications sur le centre (Tache 20) lorsqu un document est signe.

## Livrables
- UI de gestion de documents operationnelle.
- Documentation integration signature.

## Verifications
- Manual: creer un template test, generer un apercu, simuler une signature.
- Verifier l export PDF et noter les limites.

