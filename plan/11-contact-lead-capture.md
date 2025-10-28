# Tache 11 - Capture de leads multicanal

## Objectif
Concevoir une section contact + page dediee offrant formulaire, CTA WhatsApp, email, prise de rendez-vous et informations pratiques, dans l esprit multi canal de waohdigital.com.

## Contexte
Le rapport met en avant les multiples points de contact (WhatsApp, boutons CTA, adresse). Nous devons proposer une experience similaire adaptee a WLAHWLA (B2B UEMOA) avec un referentiel backend pour collecter les leads.

## Pre-requis
- Taches 01 a 10.

## Actions detaillees
1. Definir les champs du formulaire lead (nom, societe, email, telephone UEMOA, besoins, vertical) + validations regex; documenter le flux dans `docs/ops/leads.md`.
2. Implementer `frontend/src/components/forms/LeadForm.tsx` avec design tokens (fond clair, bouton accent `#5864FF`, ombre douce) et feedback `success/error`.
3. Creer le endpoint `POST /api/leads` cote backend (app `core` ou `marketing`) avec stockage en base, notifications (email ou slack stub) et tests unitaires; fournir un serializer/validation.
4. Ajouter dans `Home.tsx` une section contact reprenant les infos (adresse, email support, WhatsApp, horaires) + embed d un agenda (Calendly/Cal.com) et sur la page `/contact`, integrer une carte interactive (Leaflet) affichant hubs UEMOA.
5. Mettre a jour `docs/branding/brand-playbook.md` avec les canaux officiels et consigner les elements a capturer (screenshot formulaire) dans `docs/branding/visual-references.md`.

## Livrables
- Composant `LeadForm`, section contact sur la landing, page `/contact`.
- Endpoint backend `POST /api/leads` + tests + documentation `docs/ops/leads.md`.

## Verifications
- Tests automatises : `python manage.py test apps.core.tests.test_leads` (a creer) et, cote front, `npm test LeadForm` si coverage.
- Tests manuels: soumettre un lead en dev, verifier l enregistrement en base, les liens WhatsApp/mailto/agenda sur desktop et mobile; consigner capture ecran et flux dans `docs/ops/leads.md`.
