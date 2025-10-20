# Guide hors ligne

Cette application peut fonctionner sans connexion grâce au service worker et à la file hors‑ligne.
Voici quelques bonnes pratiques pour les équipes terrain :

## Installation PWA
- Depuis Chrome/Edge (desktop) ou Safari/Chrome (mobile), cliquez sur **Installer l’application**.
- L’icône `UEMOA Invoicer` sera ajoutée au bureau ou à l’écran d’accueil.
- L’installation garantit que les ressources essentielles (tableau de bord, factures, boutique) sont disponibles hors connexion.

## Utilisation sans réseau
1. Connectez‑vous au moins une fois en ligne pour récupérer vos données.
2. Lorsque l’indicateur passe en **Hors connexion**, continuez vos opérations normalement (création de produits, devis, factures…). Elles sont placées en file d’attente locale.
3. Le panneau **Statut synchronisation** affiche :
   - Le nombre d’opérations en attente.
   - La dernière tentative de synchronisation.
   - La dernière réussite ou l’éventuelle erreur rencontrée.
4. Dès que le réseau revient, la synchronisation est déclenchée automatiquement. Vous pouvez aussi forcer l’envoi via le bouton **Forcer la synchronisation**.

## Scénarios testés
- Création d’un produit hors ligne, puis synchronisation via `Forcer la synchronisation`.
- Mise à jour d’une facture hors ligne ; la file d’attente se met à jour et disparaît une fois la connexion restaurée.
- Lancement manuel de `/api/sync` (simulé par le bouton) pour vérifier que le backend reçoit les requêtes en file.

## Conseils supplémentaires
- Vérifiez que la date/heure du terminal est correcte : elle est utilisée pour dater les opérations en attente.
- Sur mobile, laissez l’application ouverte quelques secondes après le retour réseau pour garantir la synchronisation.
- Pour préserver l’espace disque, pensez à vider régulièrement la file si de nombreuses requêtes restent en échec (bouton **Forcer la synchronisation**).

En cas de problème récurrent, capturez le message d’erreur affiché dans le panneau de synchronisation et transmettez‑le à l’équipe support.
