# Tache 17 - Renforcer la separation des organisations

## Objectif
Assurer qu un utilisateur ne puisse jamais acceder aux donnees d une autre organisation, meme en cas de requete mal formulee.

## Contexte
Plusieurs viewsets (`backend/accounts/views.py`, `backend/billing/views.py`, `backend/reports/views.py`) ne filtrent pas les donnees par organisation. `core/utils.py` retombe sur la premiere organisation si aucune entete n est presente, ce qui est dangereux.

## Actions detaillees
- Modifier `core/utils.request_org` pour lever une erreur si aucune organisation n est determinee.
- Etendre toutes les requetes pour filtrer sur `organization` (UserViewSet doit rejoindre Membership, PaymentViewSet doit filtrer via facture).
- Ajouter des tests pour garantir que l acces inter-organisation renvoie 404 ou 403.
- Mettre a jour la documentation API pour exiger l entete `X-Org`.

## Livrables
- Filtrage strict par organisation sur toutes les routes.
- Tests unitaires couvrant plusieurs ressources critiques.
