# Tache 13 - Etendre le Control Panel pour la gestion des utilisateurs et roles

## Objectif
Permettre aux administrateurs d inviter des collaborateurs, d attribuer des roles et de suivre leur statut d activation.

## Contexte
`frontend/src/pages/AdminPanel.tsx` ne fait que lister les utilisateurs et creer un compte sans mot de passe. Il manque la gestion des roles `backend/core/models.py` (Membership) et des invitations securisees.

## Actions detaillees
- Afficher la liste des membres de l organisation avec leur role et etat.
- Ajouter un flux d invitation (envoi d email ou lien) qui cree un membership en attente.
- Permettre la modification du role et la suspension/reactivation d un membre.
- Limiter l acces a ce module aux roles autorises via la logique de garde vue.

## Livrables
- Control Panel complet avec roles.
- Notes de test (invitation reussie, changement de role, suspension).
