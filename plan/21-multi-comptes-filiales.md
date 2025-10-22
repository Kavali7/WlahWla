# Tache 21 - Gestion multi comptes et filiales

## Objectif
Permettre aux organisations de gerer plusieurs comptes ou filiales avec bascule rapide, parametres dedies et consolidation des donnees.

## Contexte
Le projet a deja un picker d organisation mais incomplet. Nous devons l etendre pour supporter des filiales UEMOA et des roles.

## Pre-requis
- Tache 19 (c-panel) et Tache 20 (timeline).

## Actions detaillees
1. Etendre le composant `OrganizationOnboarding` pour supporter la creation de filiales avec metadonnees (pays, fuseau horaire, devise).
2. Mettre a jour `OrganizationPicker` pour afficher un menu hierarchique (societe mere > filiales).
3. Adapter le store Auth pour stocker la filiale active et recalculer les KPIs en consequence.
4. Ajouter un bandeau dans le layout indiquant la filiale selectionnee avec un lien vers la configuration.
5. Documenter les scenarios multi-compte dans `docs/admin/multi-org.md`.

## Livrables
- Picker multi-niveau operationnel.
- Documentation multi-comptes.

## Verifications
- Manual: tester la bascule entre au moins deux filiales et verifier la mise a jour du dashboard.
- S assurer que les URL de redirection respectent la filiale (tests navigation).

