# Tache 19 - Admin panel et c-panel personnalise

## Objectif
Adapter l espace administrateur afin qu il offre un controle avance sur les comptes clients, les filiales et les parametres contractuels.

## Contexte
`AdminPanel.tsx` couvre deja certaines fonctions. Il faut reorganiser l UI pour fournir la meme fluidite que waohdigital et les fonctionnalites specifiques WLAHWLA.

## Pre-requis
- Tache 03 (layout) et Tache 18 (performance).

## Actions detaillees
1. Redessiner (Figma manuel) la structure du c-panel: navigation verticale, sections Compte, Paiements, Historique, Automations.
2. Mettre a jour `AdminPanel.tsx` pour adopter cette structure, en reutilisant `Tabs` et `Card`.
3. Ajouter un module de gestion des filiales/agences (creation, edition, activation, assignation d employes).
4. Integrer des parametres de marque (logo, couleurs) pour que chaque compte puisse personnaliser son experience.
5. Ajouter un audit log basique affichant les dernieres actions.

## Livrables
- C-panel restructure.
- Documentation `docs/admin/cpanel.md`.

## Verifications
- Manual: verifier que les permissions (ADMIN vs MANAGER) respectent l acces aux onglets.
- Tester la modification d une filiale et confirmer la propagation dans la nav principale.

