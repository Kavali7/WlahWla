# Tache 20 - Solidifier le workflow devis vers facture

## Objectif
Automatiser la conversion des devis en factures et garantir la coherence numerotation/statuts.

## Contexte
`backend/billing/serializers.py` accepte des lignes mais ne gere pas la creation imbriquee ni les transitions de statut. Aucun numero unique n est genere par l API.

## Actions detaillees
- Implementer des serializers qui gerent la creation et la mise a jour des lignes (create/update nested) avec validations.
- Ajouter un service pour generer les numeros conformes (cf `backend/compliance/uemoa.py`).
- Prevoir une action `POST /api/quotes/{id}/convert` pour transformer un devis accepte en facture.
- Mettre a jour les statuts selon les evenements (envoi, acceptation, rejet, conversion).

## Livrables
- Workflow complet convertissant un devis en facture.
- Tests unitaires sur la numerotation et la creation de lignes.
