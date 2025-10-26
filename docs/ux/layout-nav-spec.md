# Navigation Layout Spec - Tache 03

## Vue d'ensemble
- Inspiration: rythme waohdigital (navigation pleine largeur, transitions fluides, accent CTA).
- Objectif: proposer un shell marketing vers back-office unifie (annonce UEMOA, mega-menu, CTA "Essai gratuit", bouton WhatsApp).
- Contraintes: responsive < 640px via hamburger, focus clavier complet (Tab / Shift+Tab / Escape), annonce sticky independante du scroll.

## Wireframe textuel (desktop >= 1024px)
```
+----------------------------------------------------------------------------+
| TOP ANNOUNCEMENT BAR (sticky)                                              |
| - [Badge] Contrat UEMOA : lien detail + bouton fermer                      |
+----------------------------------------------------------------------------+
| NAV SHELL                                                                  |
| - Logo + point anime "WLAHWLA"                                             |
| - Liens principaux: Solutions v | Industries v | Ressources v | A propos   |
|   - Hover/Focus: mega-menu plein ecran (max 3 colonnes)                    |
|   - Contenu: listes + visuel leger + CTA contextuel                        |
| - Actions secondaires: bouton "Support", CTA "Essai gratuit"               |
| - Bouton WhatsApp (icone + texte)                                          |
| - Liens compte rapides (si utilisateur connecte)                           |
+----------------------------------------------------------------------------+
| MEGA MENU (overlay) |  Colonne 1: Solutions cles                           |
|                     |  Colonne 2: Parcours industries                      |
|                     |  Colonne 3: Ressources rapides                       |
+----------------------------------------------------------------------------+
| MAIN CONTENT (Outlet)                                                      |
+----------------------------------------------------------------------------+
```

## Wireframe textuel (tablette 640-1023px)
```
+-----------------------+
| Logo | Hamburger menu |
+-----------------------+
| Announcement sticky   |
| plein largeur         |
+-----------------------+
| Drawer vertical       |
| - CTA WhatsApp + CTA  |
|   Essai gratuit       |
| - Acces rapides:      |
|   Solutions,          |
|   Industries,         |
|   Ressources,         |
|   A propos            |
|   -> Sous-sections en |
|      accordeon        |
| - Liens utilitaires:  |
|   Support, Connexion  |
+-----------------------+
```

## Wireframe textuel (mobile < 640px)
```
+---------------+
| Logo | Menu   |
+---------------+
| Announcement  |
| bar sticky    |
+---------------+
| Slide-over    |
| - CTA Essai   |
|   gratuit     |
| - Bouton      |
|   WhatsApp    |
| - Groupes:    |
|   Solutions   |
|   Industries  |
|   Ressources  |
|   A propos    |
| - Ancres:     |
|   home#services     |
|   home#temoignages  |
| - Pied: Support,    |
|   Connexion         |
+---------------+
```

## Etats interactifs
- Hover / focus: bordures et glow `shadow-floating`, focus ring `--wl-focus-ring`.
- Mega-menu: visible au survol ou focus clavier sur le lien parent; cache via Escape ou perte de focus.
- Announcement: dismissible; etat memorize dans `localStorage` avec la cle `wlahwla.announcement.dismissed`.
- Sticky: la barre d'annonce et le header restent fixes au sommet.
- CTA WhatsApp: ouvre `https://wa.me/` dans un nouvel onglet avec `aria-label="Parler avec un conseiller WhatsApp"`.

## Contenu et ancres marketing
- `home#services`: scrolle vers la section services de la landing.
- `home#temoignages`: scrolle vers la section temoignages.
- Pages additionnelles: `/ressources`, `/support`, `/a-propos`, `/industries/:slug`.

## Accessibilite et mobile
- Navigation clavier: Tab parcourt la barre, Shift+Tab remonte, Escape ferme mega-menu et drawer.
- Hamburger: bouton avec `aria-controls`, `aria-expanded`, icone trois barres, focus trap dans le drawer.
- Sticky announcement: `role="status"`, `aria-live="polite"`, liens focusables.
- Cibles tactiles minimales 44px pour CTA et WhatsApp sur mobile.

## Notes de capture responsive
- `docs/ux/layout.md` doit contenir deux captures (`layout-nav-desktop.png`, `layout-nav-mobile.png`).
- Captures a realiser via navigateur (ex: Chrome DevTools) apres integration.
- Ajouter une legende sous chaque image avec viewport et contexte.
