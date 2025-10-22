# Tache 08 - Landing temoignages et preuves sociales

## Objectif
Afficher des temoignages multi-profils (entreprises UEMOA) avec photo, citation, indicateurs de resultat afin d inspirer confiance, a l image de waohdigital.

## Contexte
Il n existe pas de section temoignage structuree. Nous devons introduire un carrousel de citations, un bloc chiffres cle et eventuellement des logos.

## Pre-requis
- Tache 04 pour le carrousel generique.

## Actions detaillees
1. Collecter ou rediger trois temoignages types (client boutique, cabinet comptable, prestataire) et obtenir validation legale (manuel).
2. Ajouter `src/content/home/testimonials.ts` avec photos, roles, citations, metrics.
3. Creer le composant `TestimonialCarousel` (si `HeroCarousel` n est pas reutilisable) supportant auto-play et navigation clavier.
4. Ajouter un bloc `Resultats chiffrables` (gain de temps, evolution CA) avec une representation graphique (mini chart).
5. Greffer la section sur `Home.tsx` apres Services.

## Livrables
- Donnees `testimonials.ts`.
- Section `TestimonialCarousel` finalisee.

## Verifications
- Test manuel respect RGPD: s assurer que les donnees fictives ou publiques sont utilisees.
- Verifier que le carrousel est stoppable via clavier et accessible ARIA.

