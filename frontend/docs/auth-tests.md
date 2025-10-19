# Auth Manual Tests

Use these quick scenarios to validate the authentication flow after backend integration:

1. **Connexion valide**  
   - Naviguer vers `/login`, entrer des identifiants valides, soumettre.  
   - Verifier la redirection vers la page demandee (par defaut `/dashboard`) et la presence du menu utilisateur.  
   - Controler que les requetes API portent l entete `Authorization`.

2. **Erreur de connexion**  
   - Sur `/login`, saisir un mot de passe errone.  
   - Confirmer l affichage d un message d erreur et l absence de redirection.  
   - Verifier que la banniere disparait apres correction.

3. **Mot de passe oublie**  
   - Depuis `/login`, cliquer sur "Mot de passe oublie ?", soumettre un email.  
   - Verifier l affichage du message de confirmation lors d un HTTP 200 et le message d erreur en cas d echec (400/404).  
   - Tester avec une adresse inexistante pour s assurer d un retour neutre.

4. **Reinitialisation**  
   - Ouvrir `/reset-password?token=<jeton>` avec un jeton valide.  
   - Saisir un nouveau mot de passe et confirmer : l alerte de succes doit s afficher puis rediriger vers `/login`.  
   - Verifier l erreur "mots de passe differents".

5. **Deconnexion**  
   - Depuis une page protegee, utiliser "Se deconnecter".  
   - Confirmer la suppression du token (localStorage) et la redirection vers `/login`.  
   - Verifier qu un appel protege renvoie bien vers la connexion apres un 401.

6. **Switcher d organisation**  
   - Depuis l en-tete, changer d organisation via le selecteur.  
   - Verifier que l URL contient `?org=<code>` et que les requetes portent l en-tete `X-Org`.  
   - Recharger la page et confirmer que la selection reste active.
