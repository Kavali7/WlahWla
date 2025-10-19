# Organization Onboarding Checklist

Utilisez cette fiche pour valider la configuration initiale d'une nouvelle organisation lors de l'onboarding.

1. **Selection**  
   - Depuis n'importe quelle page protegee, ouvrez le selecteur d'organisation (en-tete).  
   - Choisissez l'organisation fraichement creee; l'URL doit inclure `?org=<code>` et toutes les requetes portent `X-Org`.

2. **Completer le profil**  
   - Verifiez la banniere "Onboarding requis" et remplissez :
     - Adresse de l'entreprise
     - Numero fiscal (IFU ou equivalent)
     - Numero de registre de commerce (RCCM)  
   - Soumettez le formulaire et confirmez l'apparition du message de succes.

3. **Controle API**  
   - Inspectez une requete reseau (ex: `PATCH /organizations/{id}/`) pour verifier la presence du header `X-Org`.  
   - Rechargez la page : la banniere doit disparaitre et l'organisation selectionnee etre conservee.

4. **Partage de lien**  
   - Copiez l'URL contenant `?org=<code>` et ouvrez-la dans une nouvelle session : l'application doit se placer automatiquement sur la meme organisation apres authentification.

5. **Verification finale**  
   - Naviguez vers un module (Dashboard, Boutique...) et confirmez que les donnees correspondent a l'organisation active.  
   - Deconnectez-vous puis connectez-vous a nouveau pour valider la persistance de la selection.
