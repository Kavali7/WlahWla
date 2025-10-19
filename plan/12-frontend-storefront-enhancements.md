# Tache 12 - Enrichir la boutique et le panier WhatsApp

## Objectif
Proposer une experience boutique plus riche avec recherche, filtrage et totaux afin de faciliter les commandes WhatsApp.

## Contexte
`frontend/src/pages/Storefront.tsx` affiche une grille basique sans recherche ni calcul du total general. Les donnees ne sont pas triees et le lien WhatsApp n inclut pas les montants.

## Actions detaillees
- Ajouter recherche plein texte et filtres (categorie, prix, disponibilite).
- Afficher le total panier (HT, TVA si active) et le nombre d articles.
- Ameliorer la mise en forme du message WhatsApp (montants, devise, informations client facultatives).
- Gerez la persistence locale du panier (localStorage) et la remise a zero apres envoi.

## Livrables
- Boutique avec recherche et panier enrichi.
- Exemples de messages WhatsApp generes apres validation.
