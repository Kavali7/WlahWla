# Tache 28 - Workflow commandes et prestations

## Objectif
Implementer un workflow complet pour les commandes (devis -> commande -> execution -> cloture) ainsi que pour les prestations planifiees.

## Contexte
Les workflows actuels sont partiels. Il faut ajouter etats, transitions et notifications.

## Pre-requis
- Taches 26 et 27.

## Actions detaillees
1. Definir les etats et transitions dans `docs/ops/order-workflow.md` (diagramme manuel).
2. Mettre a jour les models `Order` et `ServiceAssignment` pour inclure ces etats et horodatages.
3. Ajouter des signaux (post_save) pour declencher notifications et metrics.
4. Exposer des endpoints pour avancer/revenir dans le workflow et enregistrer des notes.
5. Couvrir avec des tests d integration.

## Livrables
- Workflow complet cote backend.
- Documentation du processus.

## Verifications
- Manual: simuler un workflow via shell Django ou API et verifier la timeline.
- S assurer que les notifications (webhooks) se declenchent correctement.

