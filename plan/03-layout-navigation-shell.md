# Tache 03 - Layout principal et navigation immersive

## Objectif
Refondre la structure de navigation pour rappeler l accueil fluide de waohdigital tout en offrant les acces rapides propres a WLAHWLA (commerce multi-offres, c-panel, portails clients).

## Contexte
Le composant `AppLayout.tsx` gere actuellement une navigation classique. Il faut introduire : barre superieure avec CTA, mega-menu contextualise, bandeau info UEMOA, navigation sticky.

## Pre-requis
- Tache 02 terminee pour disposer des nouveaux tokens.

## Actions detaillees
1. Concevoir sur Figma (manuel) le wireframe d une navigation comprenant : logo anime, liens marketing (Solutions, Industries, Ressources, A propos), CTA `Essai gratuit` et bouton WhatsApp.
2. Mettre a jour `src/components/AppLayout.tsx` pour integrer la nouvelle nav responsive (hamburger mobile) et la zone info (texte defilant pour annonces contractuelles).
3. Ajouter un composant `TopAnnouncementBar` alimentable via configuration JSON et expose dans le layout.
4. Revoir l architecture des routes (`src/routes/index.tsx`) pour introduire des ancres marketing (`home#services`, `home#temoignages`) et les nouvelles pages (Ressources, Support).
5. Tester la navigation clavier et mobile (manuellement) et noter les ajustements dans le rapport de tache.

## Livrables
- `src/components/AppLayout.tsx` remanie avec nouvelle nav.
- `src/components/TopAnnouncementBar.tsx` et styles associes.
- Captures responsive (desktop/mobile) ajoutees dans `docs/ux/layout.md`.

## Verifications
- Survoler les menus sur desktop et s assurer que les sous-menus se ferment correctement au clavier (Tab, Shift+Tab, Escape).
- Sur mobile, verifier la fermeture automatique du menu apres clic sur un lien (test manuel).

