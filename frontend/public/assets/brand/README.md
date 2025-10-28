# Brand Assets Inventory

Les visuels ci dessous sont des placeholders internes, inspires de la charte waohdigital/WLAHWLA. Ils sont libres de droits pour le prototype; remplacer par des photos/illustrations finales apres validation marketing.

| Fichier | Usage | Description |
|---------|-------|-------------|
| hero-commerce-1600x900.svg | HeroCarousel slide `commerce` | Degrade 135deg `#4361EE -> #3F37C9`, cockpit unifie ventes/stock/factures, badges conformite UEMOA. |
| hero-services-1600x900.svg | HeroCarousel slide `services` | Fond sombre lumineux soulignant flux devis > signature > facturation et portail client securise. |
| hero-ads-1600x900.svg | HeroCarousel slide `ads` | Degrade violet-corail avec panneaux digitaux et heatmap pour reporting ville par ville. |
| panel-analytics-640x480.svg | AdvertisingCard `analytics` | Carte sombre avec graphique en barre neon. |
| panel-cross-sell-640x480.svg | AdvertisingCard `cross-sell` | Carte claire rappelant un panneau outdoor avec CTA. |

## Workflow assets

1. Stocker les versions haute definition dans `docs/branding/source-assets/`.
2. Executer `npm run optimize:images` avant commit afin de minifier les assets pour le web.
3. Ajouter les meta donnees (credits, licence) dans ce fichier si des images externes sont integrees.

## Hero landing notes

- Copy hero : badge `Suite commerce UEMOA`, H1 `Unifiez ventes, stock et factures en temps reel`, tone assertif, phrases 12-18 mots.
- Metrics affichees : Activation `72 h`, Conversion retail `+23 %`, Temps de caisse `-35 %` (aligner sur dashboard source).
- Trust badges : `Certifie e-facturation UEMOA`, `Reconciliations banques quotidiennes` (prevoir icones definitives).
- CTA : bouton primaire `Essayer gratuitement`, secondaire `Voir la demo`, lien externe `WhatsApp` (`https://wa.me/221778889900?...`).
- Bandeau logos partenaires : placeholders texte `waohdigital media`, `Orange Money Pro`, `UBA Connect`, `ANSIE Lab`, `Sunu Assurance`. Remplacer par logos SVG (fond transparent) + renseigner credits.
