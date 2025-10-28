# Tache 19 - Console admin & gouvernance

## Objectif
Repenser le centre d administration pour offrir une gouvernance avancée (comptes clients, filiales, branding, paramètres contractuels) avec une ergonomie premium inspirée de waohdigital.com.

## Contexte
L espace admin doit centraliser la gestion des organisations, des paramètres de marque et de la gouvernance. Les utilisateurs attendent un layout clair (menu vertical, cartes, onglets) et un audit log.

## Pre-requis
- Taches 01 a 18.

## Actions detaillees
1. Formaliser l architecture cible dans `docs/admin/cpanel-wireframe.md` (sections : Synthèse, Comptes & Filiales, Branding, Facturation, Automations, Audit log) et valider avec produit.
2. Refondre `AdminPanel.tsx` (ou créer `frontend/src/pages/admin/Console.tsx`) avec navigation latérale, onglets et composants cartes alignés aux tokens WLAHWLA.
3. Implémenter modules : gestion des filiales (CRUD + activations), paramètres branding (logo, couleurs, domaine), réglages contractuels (plans, limites), et quick actions (inviter un admin, exporter données).
4. Ajouter un audit log (timeline) s appuyant sur backend (Tache 30) ou mocks temporaires; afficher filtres (type, utilisateur, date) et export CSV.
5. Documenter permissions (ADMIN, MANAGER) et flux approbation dans `docs/admin/cpanel.md`; noter les captures à produire pour la playbook.

## Livrables
- Console admin modernisée (pages + composants).
- Documentation `docs/admin/cpanel-wireframe.md` et `docs/admin/cpanel.md`.

## Verifications
- Tests manuels : vérifier accès par rôle, création/édition filiale, mise à jour branding.
- Tests automatisés sur permissions (front) et endpoints utilisés (backend) + audit accessibilité sur la page principale.
