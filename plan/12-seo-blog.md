# Tache 12 - Hub ressources et SEO

## Objectif
Mettre en place un hub contenu (blog, etudes, guides) pour ameliorer le SEO et nourrir les CTA (demo, essai, rendez-vous) en cohérence avec les verticales WLAHWLA.

## Contexte
Le rapport signale que waohdigital oriente fortement vers des contenus marketing (formations, store). Nous devons creer un espace ressources modulable, integrer les extraits sur la landing et equiper le site de balises meta / sitemap.

## Pre-requis
- Taches 01 a 11.

## Actions detaillees
1. Definir l arborescence `frontend/src/content/blog/` avec frontmatter (titre, slug, extrait, vertical, mots clefs, lecture, CTA) et produire 3 articles pilote (facturation UEMOA, commerce, campagnes).
2. Installer/Configurer le support Markdown ou MDX (via `vite-plugin-mdx` ou parser maison) et ajouter les composants wrappers (Callout, VideoEmbed) pour les articles.
3. Developper les pages `BlogIndex.tsx`, `BlogPost.tsx`, `BlogCategory.tsx` (filtre par vertical) + navigation breadcrumbs; integrer un module `RelatedPosts`.
4. Ajouter un bloc `Ressources` sur la home et les pages verticales (cartes style waohdigital) avec CTA `Lire`, `Voir la demo`; exposer un feed JSON pour future integration.
5. Mettre en place SEO technique : sitemap statique (`/sitemap.xml`), balises Open Graph/Meta dynamiques, balises JSON-LD (Organisation) dans `frontend/src/lib/seo.ts`; documenter la procedure Search Console dans `docs/ops/seo.md`.

## Livrables
- Hub blog complet (contenu, pages, composants).
- Bloc ressources sur la landing et pages verticales.
- Documentation `docs/ops/seo.md`.

## Verifications
- Tests manuels (desktop/mobile) sur un article; verif schema (Rich Results test) et consignation des resultats.
- Execution `npm run build` pour s assurer que l import Markdown/MDX passe et que le sitemap est genere.
