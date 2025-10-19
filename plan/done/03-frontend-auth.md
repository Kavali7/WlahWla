# Tache 03 - Construire les ecrans d authentification et gestion de session

## Objectif
Permettre aux utilisateurs de se connecter, se deconnecter et recuperer leur mot de passe via des ecrans dedies relies a la future API d authentification.

## Contexte
Aucun ecran de connexion n est present et `frontend/src/lib/api.ts` ne gere pas de jeton. Le Control Panel affiche la liste des utilisateurs sans verification. Cette situation empeche tout deploiement multi utilisateur securise.

## Actions detaillees
- Creer des pages `Login`, `MotDePasseOublie` et `ResetPassword` avec formulaires valides (gestion des erreurs, etat de chargement).
- Etendre `frontend/src/lib/api.ts` pour stocker un token (Authorization header) et rafraichir le profil utilisateur courant.
- Ajouter un contexte React ou un store pour conserver l etat de session (utilisateur courant, organisation selectionnee).
- Implementer une methode de deconnexion qui nettoie le token et redirige vers la page de login.

## Livrables
- Nouvelles routes d authentification operationnelles.
- Gestion centralisee du token et du profil utilisateur.
- Scenarios de test manuels documentes (connexion valide, erreur, deconnexion).
