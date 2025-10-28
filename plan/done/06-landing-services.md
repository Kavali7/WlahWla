# Tache 06 - Section offres clefs facon Waoh Digital

## Objectif
Structurer la section « Nos solutions » de la landing pour presenter les modules WLAHWLA (Commerce, Facturation, Campagnes, Support) avec des cartes proche du rendu waohdigital.com : icone cercle, hover translate, CTA et texte orienté benefices.

## Contexte
Le rapport recommande de reutiliser le pattern « Nos solutions digitales clés en main » (3 cartes verticales + hover). Nous devons decliner cette section pour WLAHWLA avec 4 cartes + un CTA global, tout en utilisant les tokens couleurs/ombres definis (fond blanc, ombre douce, radius 10px, accent `#5864FF`).

## Pre-requis
- Taches 01 a 05.

## Actions detaillees
1. Cartographier les offres prioritaires (Commerce omnicanal, Facturation & conformite, Campagnes publicitaires, Support & analytics) et valider les arguments/bullet points via marketing (manuel).
2. Creer `frontend/src/content/home/services.ts` avec les meta-donnees des cartes (`id`, `icon`, `title`, `summary`, `bullets`, `cta`).
3. Developper ou adapter un composant `ServiceCard` dans `frontend/src/components/marketing/ServiceCard.tsx` reprenant le style waohdigital (icone dans cercle, ombre `shadow-service`, translate Y -10px au hover).
4. Integrer la section dans `frontend/src/pages/Home.tsx` avec grille responsive (3 colonnes desktop, stack mobile) et un CTA global `Explorer toutes les solutions` pointant vers la page modules.
5. Documenter la variante dans `docs/branding/components-cheatsheet.md` et consigner les captures necessaires dans `docs/branding/visual-references.md`.

## Livrables
- Donnees `services.ts` et composant `ServiceCard`.
- Section services finalisee dans `Home.tsx`.
- Documentation mise a jour (cheatsheet + references).

## Verifications
- Test responsive (Chrome devtools) pour s assurer de l empilement propre des cartes et du comportement hover/touch.
- Controle navigation: chaque CTA redirige vers une route existante; consigner liens testes dans le compte rendu manuel.
