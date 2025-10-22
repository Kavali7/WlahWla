# Tache 12 - SEO, blog et contenu evergreen

## Objectif
Apporter une section ressources/blog qui renforce la credibilite et le SEO, avec categories alignees sur les verticales et appels a la demo.

## Contexte
Pas de blog actuellement. Il faut preparer la structure (listing, categories, page article) et integrer les extraits sur la home.

## Pre-requis
- Tache 07 pour la structuration des verticales.

## Actions detaillees
1. Definir l arborescence `content/blog/` (fichiers markdown) avec meta (titre, resume, tags, date, temps de lecture).
2. Mettre en place un loader (ex: `vite-plugin-mdx` ou parser maison) pour rendre les articles dans `src/pages/blog`.
3. Creer `BlogIndex.tsx` et `BlogPost.tsx` avec `react-router`.
4. Ajouter un bloc `Derniers articles` sur la home et sur les pages verticales.
5. Generer un sitemap statique et balises meta (Open Graph) dans `index.html`.

## Livrables
- Pages blog operationnelles.
- Trois articles de demo dans `content/blog/`.

## Verifications
- Manual: valider le rendu d un article sur mobile.
- Executer `npm run test` si des tests existent pour le routing.
- Soumettre l URL du sitemap via Search Console (action manuelle documentee).

