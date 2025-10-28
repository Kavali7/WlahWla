# Tache 10 - Blocs publicitaires et modules cross-sell

## Objectif
Decliner les « panneaux publicitaires » a la maniere de waohdigital.com pour presenter des offres partenaire ou campagnes WLAHWLA (AdvertisingCard, bannieres hero, sliders).

## Contexte
Le rapport recommande de valoriser les campagnes via cartes lumineuses, gradient et CTA (ex: Marketing digital, ImmoManager, Store). Nous avons deja `AdvertisingCard`; il faut creuser le systeme de slots (landing, pages modules) et documenter leurs usages.

## Pre-requis
- Taches 01 a 09.

## Actions detaillees
1. Categ oriser les slots (Promo interne, Partenaire, Offre combo) et consigner les regles (formats, CTA, couleurs) dans `docs/branding/components-cheatsheet.md` + creer `docs/marketing/ad-slots.md`.
2. Enrichir `AdvertisingCard` (support badges multiples, overlays, version sombre/claire) et developper un composant `PromoBillboard` plein ecran dans `frontend/src/components/marketing/PromoBillboard.tsx`.
3. Alimenter `frontend/src/content/home/promo-slots.ts` et `frontend/src/content/modules/promo-slots.ts` pour injecter les cartes sur la landing et les pages modules; inclure les assets definitifs (SVG/PNG WebP).
4. Ajouter un slider (peut reutiliser `HeroCarousel` en mode banners) pour afficher plusieurs panels dans `Home.tsx` et une section dediee sur la page `Campaigns`.
5. Prevoir un fallback texte accessible (balises `aria-label`, contenu degrade >4.5:1) et noter les captures a prendre dans `docs/branding/visual-references.md`.

## Livrables
- Composants `AdvertisingCard` evolue et `PromoBillboard`.
- Contenus `promo-slots.ts` (landing + modules).
- Documentation `docs/marketing/ad-slots.md`.

## Verifications
- Tests manuels desktop/mobile (hover, swipe, fallback).
- Audit Lighthouse pour la section banners (lazy-load images, CLS) et consigner les mesures dans `docs/branding/brand-playbook.md`.
