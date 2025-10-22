# UEMOA Invoicer – Starter

**Backend**: Django + DRF + Celery · **Frontend**: React (Vite) + Tailwind + Recharts · **PWA Offline** · **WhatsApp** (Click‑to‑Chat) · **Admin Panel**.

## Points clés
- **Pays par défaut**: Bénin (`country_code=BJ`) ; **UEMOA** pris en charge (BJ, BF, CI, GW, ML, NE, SN, TG).
- **Taxe par défaut**: 18% **activable/désactivable** par organisation (`Organization.tax_enabled`, `default_tax_rate`).
- **Articles** avec **unités de mesure** (`UnitOfMeasure`) + prix, taxes.
- **Commande client** par WhatsApp (Click‑to‑Chat) depuis la **boutique** (Storefront).
- **Mode hors‑ligne** (PWA) avec **file d’attente** IndexedDB → synchronisation `/api/sync`.
- **Control Panel** (admin interne) + **Django admin** classique.

## Démarrage rapide
```bash
# 1) Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# 2) Frontend
cd ../frontend
npm install
npm run dev
```
Ou via Docker: `docker compose up --build`

## Routage & API
- Django Admin: `http://localhost:8000/admin/` (gérer utilisateurs, produits, etc.).
- API DRF: `http://localhost:8000/api/` (produits, clients, factures, ...).
- Frontend: `http://localhost:3000` (Dashboard, Boutique, Control Panel).

## Offline & Sync
- Un **service worker** met en cache les ressources de base.
- Les **requêtes API** échouées hors‑ligne sont **mises en file** (IndexedDB) et **rejouées** lors du retour en ligne ou via le bouton *Forcer la sync*.
- Endpoint de réception: `POST /api/sync` (à spécialiser selon vos besoins).

## WhatsApp & commandes
- Renseigner `whatsapp_number` dans l’**Organization** (ex: `22991000000` sans `+`).
- La boutique propose un **lien Click‑to‑Chat** avec le récapitulatif du panier.
- Pour l'**API WhatsApp Business** (Cloud), compléter `billing/integrations/whatsapp.py` et gérer les tokens.

## Conformité UEMOA (OHADA)
- Module `compliance/uemoa.py`: vérifications génériques (RCCM, IFU) + numérotation `FAC-{COUNTRY}-{YYYY}-{SEQ:6}` (à adapter).
- Ajoutez vos règles pays ou e‑facturation si nécessaire.

## Personnalisation PDF & e‑mail
- Modèle HTML par défaut: `billing/templates/invoice_default.html`.
- Endpoint d’envoi: `POST /api/invoices/{id}/send_email` (param `to` si besoin).
- Remplacez le backend e‑mail par SMTP en prod (voir `settings.py`).

## Control Panel (c‑panel)
- UI légère **/admin** (hash‑route `#/admin`) pour gérer les utilisateurs.
- Pour des permissions avancées, compléter les vues/permissions DRF.

## Multi‑tenant
- `OrganizationMiddleware` détecte l’organisation via `X-Org` ou sous‑domaine (stub).

## À faire / idées
- CRUD complet Devis → Facture, Paiements, Approvisionnement.
- Calculs de stocks et ruptures.
- Rôles fins & sécurité (politiques par vue).
- Séquence de numérotation verrouillée DB.
- UI plus riche (filtre, recherche, shadcn/ui si souhaité).
