# Tache 08 - Preuves sociales et carrousel temoignages

## Objectif
Mettre en place une section temoignages dynamique (slider type Waoh Digital) qui met en avant des clients UEMOA par secteur avec citation, photo, KPI et logos partenaires.

## Contexte
Le rapport souligne la presence de temoignages (portraits + citations) sur waohdigital.com. Nous devons decliner ce pattern pour WLAHWLA (carrousel swipeable, metrics + badge secteur) afin de renforcer la confiance et preparer les pages verticales.

## Pre-requis
- Taches 01 a 07.

## Actions detaillees
1. Rediger au moins quatre temoignages (Retail Dakar, Agence marketing Abidjan, Cabinet comptable Lomé, Groupe multi filiales) avec KPI et obtenir validation juridique/marketing (manuel).
2. Ajouter `frontend/src/content/home/testimonials.ts` (data) et `frontend/src/content/testimonials/*.ts` pour les pages dediees; integrer chemins vers photos (ou placeholders temp) dans `frontend/public/assets/brand/`.
3. Creer `TestimonialCarousel` dans `frontend/src/components/marketing/TestimonialCarousel.tsx` avec auto-play optionnelle, commandes clavier, dots (ARIA) et animations type translate/opacity.
4. Greffer la section dans `Home.tsx` sous les services + ajouter un bloc `Resultats chiffrables` sous forme de 3 stats (gain temps, ROI, satisfaction) stylise via tokens `shadow-elevated`.
5. Documenter le composant et les besoins capture (shots, video scroll) dans `docs/branding/components-cheatsheet.md` et `docs/branding/brand-playbook.md`.

## Livrables
- Donnees `testimonials.ts` et medias associes.
- Composant `TestimonialCarousel` et section home integree.
- Documentation mise a jour (cheatsheet + playbook).

## Verifications
- Tests clavier/lecteur ecran (tab, shift+tab, roles ARIA) pour naviguer dans le carrousel et arreter l auto-play.
- Audit Lighthouse accessibilite > 90 et capture des scores dans `docs/branding/brand-playbook.md`.
