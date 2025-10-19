# Module catalogue produits

Cette interface permet aux equipes de gerer leurs fiches produits directement dans l'administration.

## Ajouter un produit
- Ouvrir **Administration > Catalogue** puis cliquer sur **Nouveau produit**.
- Renseigner le nom, le SKU interne et le prix unitaire.
- Associer une taxe ou une unite si elles existent deja (les listes sont alimentees par `/api/taxes/` et `/api/units/`).
- Cocher l'option *Produit actif* pour l'afficher dans la boutique et la facturation.
- Valider : le produit est disponible immediatement dans les autres modules.

## Modifier ou dupliquer
- Cliquer sur **Editer** pour ajuster une fiche existante.
- Utiliser **Dupliquer** pour creer rapidement une variante (le SKU est pre-rempli avec le suffixe `-copy`).
- Le statut peut etre archive/re-affiche via le bouton **Archiver/Activer** sans perdre les donnees.

## Recherche et pagination
- La barre de recherche filtre par nom, SKU ou description.
- Le tableau est triable (Nom, SKU, Prix) et pagine automatiquement tous les 10 elements.
- Le filtre *Actifs/Archives* permet de verifier le catalogue avant une synchronisation inventaire.
