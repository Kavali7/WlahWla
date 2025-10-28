# Tache 05 - Hero landing inspire de Waoh Digital

## Objectif
Installer un hero immersif pour WLAHWLA qui reprend les codes visuels observes sur waohdigital.com (degrade bleu/violet, CTA multiples, mise en avant benefices) tout en exprimant la proposition de valeur facturation + commerce + campagnes UEMOA.

## Contexte
Le rapport d analyse UI/UX recommande d aligner le hero sur la direction artistique Waoh Digital : degrade `#4361EE -> #3F37C9`, badges de preuve, double CTA (Essai / Demo) et carrousel d illustrations. Les composants de base (`HeroCarousel`, tokens) existent deja mais doivent etre relies a la page d accueil et aux contenus definitifs.

## Pre-requis
- Taches 01 a 04 finalisees (tokens, assets, documentation).

## Actions detaillees
1. Rediger le contenu hero (titre, sous titre, metrics, badges confiance) en s appuyant sur `docs/branding/brand-playbook.md` et le rapport Waoh Digital; faire valider le wording en relecture marketing (manuel).
2. Mettre en place la section hero dans `frontend/src/pages/Home.tsx` en combinant `HeroCarousel`, un bloc texte a gauche et un bandeau logos partenaires; appliquer le gradient `linear-gradient(135deg, #4361EE, #3F37C9)`.
3. Connecter les CTA `Essayer gratuitement` (lien vers flow inscription) et `Voir la demo` (ouvre section video ou route demo) + un lien secondaire `WhatsApp` format wa.me.
4. Ajouter les micro interactions recommandees (fade-in, translation sur scroll) via `framer-motion` ou utilitaire existant tout en conservant un CLS < 0.1 (images pre dimensionnees).
5. Mettre a jour `frontend/src/content/hero-slides.ts` et `frontend/public/assets/brand/README.md` avec les textes definitifs du hero et noter les captures a realiser dans `docs/branding/visual-references.md`.

## Livrables
- Bloc hero mis a jour dans `frontend/src/pages/Home.tsx` avec styles tokens.
- Contenu hero actualise dans `frontend/src/content/hero-slides.ts`.
- Notes editorial/visuelles ajoutees a `docs/branding/visual-references.md`.

## Verifications
- Test manuel focus clavier et lecteur ecran sur CTA et pagination du carrousel.
- Audit Lighthouse (Performance + Accessibilite) sur la home et capture des scores dans `docs/branding/brand-playbook.md`.
