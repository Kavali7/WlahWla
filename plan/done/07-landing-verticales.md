# Tache 07 - Cas d usage verticaux type Waoh Digital

## Objectif
Segmenter la landing page par industries (Retail omni canal, PME comptables, Prestations de services, Agences marketing) afin de reprendre l approche « cartes verticales » de waohdigital.com et renvoyer vers des pages detaillees.

## Contexte
Waoh Digital rassure via une section « Nos solutions » multi cartes. Pour WLAHWLA, le rapport recommande d ajouter une section verticale avec icone circulaire, liste a puces et CTA. Chaque vertical doit pointer vers une sous page dediee qui detaille workflows, integrations et preuves sociales.

## Pre-requis
- Taches 01 a 06.

## Actions detaillees
1. Selectionner quatre verticales prioritaires et produire le contenu (titre, description, 3 benefices, chiffres clefs) en coordination marketing; archiver les textes dans `docs/branding/brand-playbook.md`.
2. Creer `frontend/src/content/home/verticals.ts` et `frontend/src/content/verticals/<slug>.ts` pour stocker les contenus structurés (icones, hero, sections).
3. Ajouter la section `Verticales` dans `Home.tsx` avec un composant `VerticalCard` reprenant l esthetique waohdigital (fond clair `#F8F9FA`, icone cercle, hover accent).
4. Mettre en place le routage `frontend/src/pages/verticals/*.tsx` avec un composant generique `VerticalLayout` integrant hero, use cases, CTA demo et carrousel de temoignages contextuels.
5. Documenter les pages creees dans `docs/branding/components-cheatsheet.md` + noter les captures a prendre pour chaque vertical dans `docs/branding/visual-references.md`.

## Livrables
- Section verticales sur la home et pages associees (`/verticals/:slug`).
- Contenus JSON/TS par vertical dans `frontend/src/content/verticals`.

## Verifications
- Navigation testee manuellement sur desktop et mobile (CTA, retours accueil).
- Audit Lighthouse « Navigation page verticale » pour controler la performance; enregistrer les scores dans `docs/branding/brand-playbook.md`.
