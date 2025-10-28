# Tache 09 - Section « A propos » et page equipe

## Objectif
Raconter l ADN WLAHWLA (mission, equipe, empreinte UEMOA) avec une section landing et une page dediee, en s inspirant du ton direct et rassurant de waohdigital.com (« Votre partenaire digital en Afrique »).

## Contexte
Le rapport souligne l importance d un bloc expertise (+5 ans, support local, approche innovante). Nous devons transposer cette narration sur le site WLAHWLA avec chiffres clefs, timeline et liens recrutement.

## Pre-requis
- Taches 01 a 08.

## Actions detaillees
1. Produire le contenu (mission, promesse, chiffres operations, couverture pays, valeurs) et recueillir validation direction/marketing (manuel).
2. Ajouter une section `A propos` dans `Home.tsx` reprenant la structure waohdigital : fond clair `#F8F9FA`, badge expertise (`+X ans`), 3 colonnes d arguments, double CTA (`Nous contacter`, `Nos services`).
3. Creer la page `/about` (`frontend/src/pages/About.tsx`) avec hero, timeline (dates clefs), portraits equipe, blocs pays (cartes ou listes) et un CTA `Rejoindre WLAHWLA`.
4. Alimenter `frontend/src/content/about/*` pour isoler textes/stats; stocker les visuels dans `frontend/public/assets/brand/about/`.
5. Ajouter la route `/about` au router, mettre a jour la navigation (header + footer) et documenter les captures a prevoir dans `docs/branding/visual-references.md`.

## Livrables
- Section `A propos` sur la landing.
- Page `About` complete avec contenus et assets.
- Contenus structure dans `frontend/src/content/about/`.

## Verifications
- Test responsive (desktop/tablette/mobile) + acces clavier sur CTA.
- Controle des liens externes (ouvrent dans nouvel onglet avec `rel="noopener"`); consigner dans le compte rendu.
