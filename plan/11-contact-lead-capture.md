# Tache 11 - Contact multi canal et prise de rendez-vous

## Objectif
Mettre en place une section contact complete (formulaire, WhatsApp, e-mail, agenda) pour convertir les visiteurs en leads qualifies.

## Contexte
Waohdigital affiche plusieurs canaux. Nous devons offrir : formulaire, WhatsApp, telephone, agenda, carte interactive.

## Pre-requis
- Taches 03 et 05 finalisees.

## Actions detaillees
1. Concevoir un formulaire avec validation (nom, email, telephone, besoin, budget) et developper `src/components/forms/LeadForm.tsx`.
2. Connecter le formulaire a un endpoint backend (provisoire) via `POST /api/leads` (a stubber pour l instant) et gerer les notifications visuelles.
3. Ajouter des boutons secondaires (WhatsApp +226 54 25 55 84, e-mail growpeakagence@gmail.com, appel direct) avec des icones FontAwesome.
4. Integrer un widget de prise de rendez-vous (Calendly ou alternative gratuite). Documenter la configuration dans `docs/ops/appointments.md`.
5. Ajouter une carte interactive (Leaflet) indiquant les hubs UEMOA.

## Livrables
- Section Contact finalisee sur `Home.tsx` et page `Contact.tsx` dediee.
- Documentation widget agenda.

## Verifications
- Test manuel du formulaire (environnement de dev) et capture du payload envoye.
- Verifier que les liens WhatsApp et mailto fonctionnent sur mobile et desktop.

