# WLAHWLA Brand Playbook - Vision Marque UEMOA

## Contexte
WLAHWLA veut harmoniser son expression de marque pour les marches UEMOA en s inspirant de la dynamique visuelle de waohdigital tout en mettant en avant une offre commerce et services multi verticale. Ce guide pose les fondations creatives a appliquer sur le site web, les assets marketing et les supports internes.

## Prerequis et hypotheses
- Benchmark waohdigital.com note: **non fourni dans le depot**. Ce playbook capture les observations disponibles et marque l action a completer dans `docs/branding/visual-references.md`.
- Liste des offres validee par l equipe produit: **non fournie**. La cartographie ci dessous utilise les quatre familles citees dans la feuille de route (produits comptables, produits non comptables, prestations de service, solutions publicitaires).

## Audience map et offres
| Segment cle | Objectifs | Points de douleur | Proposition WLAHWLA |
|-------------|-----------|-------------------|----------------------|
| PME comptables et cabinets | Industrialiser la facturation et la conformite fiscale | Process manuels, suivi des pieces, obligations locales | Suite SaaS de facturation, relances automatises, rapports conformes UEMOA |
| Commercants et retailers multi boutiques | Centraliser ventes et stocks on/offline | Donnees dispersees, manque de vitrine digitale | Catalogue produits, synchronisation inventaire, modules paiement locaux |
| Agences marketing et medias | Vendre des campagnes pour leurs clients | Absence de hub publicitaire, reporting limite | Cartes publicitaires WLAHWLA, suivi temps reel, offres combinees commerce + ads |
| Prestataires de services (juridiques, logistique, consulting) | Formaliser les missions et la relation client | Onboarding lent, documents non signes | Portail client, signatures numeriques, workflow de prestations |
| Groupes multi filiales | Partager une vision groupe et controler les filiales | Manque de gouvernance, reporting difficile | Administration multi comptes, reporting consolide, espaces delegues |

## Piliers de marque
1. **Futuriste pragmatique**: prendre les codes technologiques (degrade neon, animations) pour rassurer sur l innovation tout en restant direct sur le business.
2. **Fiable et regulatoire**: garantir la conformite fiscale et documentaire UEMOA via preuves et labels.
3. **Panafricain humain**: mettre en avant equipes, clients et visuels locaux sans cliches.
4. **Performance actionnable**: chaque experience doit mener vers une action mesurable (CTA clair, prochaines etapes visibles).

## Voix editoriale
- **Ton**: assertif, optimiste, accompagne (phrase active, evidence, chiffres concrets).
- **Style**: phrases courtes 12-18 mots, verbe fort en debut, eviter jargon obscur. Utiliser pronoms inclusifs (nous, vous).
- **Etiquettes a bannir**: buzzwords flous (disruptif, revolutionnaire) sans preuve; references hors du contexte UEMOA.
- **Cadence**: titres impactants, sous titres explicatifs, puces orientees resultat.

## Palette chromatique
### Degrade primaire
- `Linear 135deg` de `#4361EE` (bleu royal) vers `#3F37C9` (violet profond). Utiliser sur heros, boutons CTA principal, fonds de sections principales.
### Couleurs secondaires et accents
- `#0A1128` (bleu marine) pour textes titres et fonds sombres.
- `#101630` (bleu graphite) pour fonds neutres et cartes.
- `#FCA311` (orange ambre) pour CTA secondaires, badges, survol.
- `#FF6B35` (corail chaud) pour alertes positives, highlight graphiques.
- `#F5F7FD` (gris bleute) pour fonds lumineux et sections testimoniaux.
### Contraste
- Associer `#0A1128` sur `#F5F7FD` ou degrade primaire pour respecter AA.
- Tester `#FFFFFF` sur degrade avec opacite 90% ou apply overlay `rgba(10,17,40,0.6)` pour texte long.

## Duo typographique
- **Headings**: `Figtree SemiBold` (fallback: `Poppins`, `Helvetica Neue`, `Arial`, sans-serif). Utiliser 32/40/56 px selon hierarchie.
- **Body**: `Inter Regular` (fallback: `Roboto`, `Helvetica Neue`, `Arial`, sans-serif). Taille 16 px, interligne 150%.
- **Numeriques**: utiliser `Inter Medium` pour chiffres et KPI afin de garantir lisibilite sur dashboards.

## Iconographie et imagerie
- Pictogrammes lineaires a coins arrondis, epaisseur 2 px, angles legerement adoucis.
- Illustrations: scenes de bureaux modernes, materiel technologique, palettes lumineuses, silhouettes UEMOA avec vetements contemporains.
- Photos: privilegier lumiere naturelle, angles trois-quarts, plans rapproches sur interactions (tablettes, caisses, signatures).
- Pattern d habillage: formes geometriques superposees (rectangles, arcs) utilises en arriere plan avec opacite 12%.
- Ratio visuel: 60% visuel, 40% contenu texte pour cartes; 70% visuel, 30% texte pour heros.

## Guidelines hero et cartes
- **Hero principal**: degrade `linear-gradient(135deg, #4361EE, #3F37C9)`, bloc gauche texte (H1 56 px, sous titre 20 px), bloc droit illustration HeroCarousel. Integrer badge top line 12 px, metrics (Activation 72 h, Conversion retail +23 %, Temps de caisse -35 %), triple CTA (`Essayer gratuitement`, `Voir la demo`, `WhatsApp`) et deux badges confiance (`Certifie e-facturation UEMOA`, `Reconciliations banques quotidiennes`). Micro interactions fade-in + slide sur hero et bandeau logos partenaires.
- **Cartes produits/offres**: dimension 320x380 px desktop, fond `#101630`, overlay degrade coin superieur droit. Inclure icone 56 px, titre 20 px, 3 puces, CTA micro `En savoir plus`.
- **Cartes testimoniaux**: fond clair `#F5F7FD`, photo ronde 64 px, etoiles degrade, citation 18 px en italique.
- **Sections multi colonnes**: conserver gouttiere 32 px, utiliser icones lineaires orange pour guider le regard.

## Guide de message cle
- **Proposition de valeur**: "La plateforme UEMOA qui unifie facturation, vente omnicanale et campagnes publicitaires, pour des equipes qui veulent agir vite et rester conformes."
- **Slogans courts**: "Vendez. Facturez. Brillez.", "Vos operations UEMOA, un tableau de bord unique.", "Des campagnes qui convertissent et se justifient."
- **Arguments par segment**:
  - PME comptables: declaratifs automatiques, workflows approuves, rapports signatures.
  - Commercants: caisse connectee, offre cross canal, stocks temps reel.
  - Agences marketing: packaging media, tracking multi canaux, reporting live.
  - Prestataires: portails clients, contrats numeriques, suivi satisfaction.
  - Groupes: controle filiales, permissions role base, monitoring multi pays.

## Implementation produit
- Mettre a jour `frontend/src/pages` avec cette hierarchie typographique et colorimetrie.
- Centraliser les tokens dans `frontend/src/lib/theme.ts` (a creer si absent) avec degrade, palette, typographies.
- Coordonner avec backend pour exposer preuves sociales (temoignages, certificats) dans endpoints existants.
- Documenter la declinaison dans les prochaines taches du dossier plan (navigation, assets, landing pages).

## Actions manuelles a planifier
1. Composer un moodboard textuel et visuel: remplir `docs/branding/visual-references.md` avec captures ou descriptions precises, ajouter lien Figma ou PDF commun.
2. Auto revue marketing: presenter cette vision au responsable produit, collecter feedback, marquer les resolutions dans le fichier de livrable.
3. Controle contraste AA: utiliser WebAIM Contrast Checker (`https://webaim.org/resources/contrastchecker/`) pour chaque combinaison critique (texte blanc sur degrade, texte marine sur fond clair) et reporter les resultats dans ce fichier.

## Hero landing 2025
- Badge hero: `Suite commerce UEMOA`.
- Titre: `Unifiez ventes, stock et factures en temps reel`.
- Sous titre: `Pilotez boutiques, WhatsApp et deliveries depuis un cockpit unique aligne sur les normes fiscales et bancaires locales.` (150 % line height).
- Metrics hero: Activation `72 h`, Conversion retail `+23 %`, Temps de caisse `-35 %`.
- Trust badges: `Certifie e-facturation UEMOA`, `Reconciliations banques quotidiennes`.
- CTA primaires: `Essayer gratuitement` (primary), `Voir la demo` (secondary), `WhatsApp` (outline externe).
- Bandeau logos: `waohdigital media`, `Orange Money Pro`, `UBA Connect`, `ANSIE Lab`, `Sunu Assurance` + focus reveal.

## Verifications 2025-10-28
- Focus clavier: hero et carrousel testes via Playwright (dev token local). Ordre confirme pour CTA `Essayer gratuitement`, `Voir la demo`, `WhatsApp` puis pagination (`‹`, `›`, puces `Aller vers ...`).
- Lighthouse desktop (stub API interne): Performance `98`, Accessibilite `91`. Commande: `node .tmp-run-lighthouse.cjs` (serveur static + `npx lighthouse`).
