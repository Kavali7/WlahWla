# Tache 13 - Dashboard overview experience

## Objectif
Refondre le tableau de bord principal pour refleter les besoins commerciaux (ventes, commandes, performances) avec un design inspire de waohdigital mais oriente multi-offres.

## Contexte
`src/pages/Dashboard.tsx` contient des widgets generiques. Il faut integrer graphiques, progression d objectifs, flux d activite.

## Pre-requis
- Taches 02 et 05 terminees.

## Actions detaillees
1. Redefinir la structure des widgets (Ventes du mois, Commandes en cours, Paiements en attente, Satisfaction clients) et documenter dans `docs/ux/dashboard.md`.
2. Implementer des composants `KpiCard`, `TrendChart`, `ActivitiesTimeline` dans `src/components/dashboard/`.
3. Connecter les widgets aux endpoints existants ou mocker via `src/mocks/dashboard.ts` en attendant l integration backend (Taches 25-31).
4. Ajouter un systeme de filtres (periode, branche) dans la barre superieure du dashboard.
5. Tester la responsivite (grid deux colonnes sur desktop, stack mobile) et ajuster.

## Livrables
- `Dashboard.tsx` refonte complete.
- Documentation des KPIs dans `docs/metrics/kpis.md`.

## Verifications
- Manual: verifier que chaque carte affiche un fallback si les donnees sont absentes.
- Capturer une video Loom (manuel) pour partager la nouvelle experience a l equipe.

