# Tache 05 - Landing hero et proposition de valeur

## Objectif
Construire une section hero immersive, equilibree entre texte et visuel, reprenant le degrade et le carrousel mis en place tout en traduisant la proposition WLAHWLA.

## Contexte
La home actuelle manque d effet `wow`. Nous devons afficher le hero degrade, le carrousel, deux CTA (Essai gratuit, Prendre rendez-vous WhatsApp) et un badge UEMOA.

## Pre-requis
- Taches 03 et 04 completes.

## Actions detaillees
1. Rediger les textes hero (titre fort, sous-titre, puces de confiance) bases sur le playbook (Tache 01) et valider avec marketing (manuel).
2. Integrer la section dans `src/pages/Home.tsx` avec `HeroCarousel`, gradient et badges de certification.
3. Ajouter des micro interactions (apparition en fade, compteur clients) via `framer-motion` ou `react-awesome-reveal`.
4. Connecter le CTA Essai a la page d inscription et le CTA WhatsApp au numero `+226 54 25 55 84`.
5. Ajouter un bandeau de logos clients/partenaires en dessous du hero.

## Livrables
- Nouvelle section hero dans `Home.tsx`.
- Donnees hero structurees dans `src/content/home/hero.ts`.

## Verifications
- Test manuel de l accessibilite: le focus doit passer sur les CTA.
- Mesure du CLS via Lighthouse pour s assurer que le carrousel ne provoque pas de reflow important.

