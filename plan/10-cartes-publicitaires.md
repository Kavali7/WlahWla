# Tache 10 - Cartes publicitaires et espaces partenaires

## Objectif
Introduire des emplacements declinables pour des campagnes partenaires (panneaux publicitaires, cross-sell) afin d imiter les sections visuelles waohdigital.

## Contexte
WLAHWLA souhaite pouvoir mettre en avant des offres speciales ou des partenaires. Il faut creer des blocs modulaires reutilisables sur plusieurs pages.

## Pre-requis
- Tache 04 pour les composants visuels.

## Actions detaillees
1. Definir les types de cartes (promo interne, partenaire, success story) et les documenter dans `docs/marketing/ad-slots.md`.
2. Developper un composant `PromoBillboard` avec image pleine largeur, overlay degrade, CTA.
3. Ajouter un gestionnaire de configuration `src/content/home/promo-slots.ts` pour injecter ces cartes sur la home et le Storefront.
4. Integrer un slider d images defilantes pour afficher des panneaux successifs; utiliser `HeroCarousel` si compatible sinon creer `RotatingBanner`.
5. Ajouter un test visuel manuel: verifier que chaque slot respecte les contrastes et qu un fallback textuel existe.

## Livrables
- Composant `PromoBillboard` et configuration associee.
- Documentation `docs/marketing/ad-slots.md`.

## Verifications
- Sur mobile, s assurer que la carte n empiete pas sur le contenu principal (test manuel).
- Preparer un screenshot a remettre aux partenaires pour validation (manuel).

