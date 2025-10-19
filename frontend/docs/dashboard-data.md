# Dashboard Data Sources

Endpoints consommes par `src/pages/Dashboard.tsx` :

| Endpoint | Parametres | Description | Format attendu |
|----------|------------|-------------|----------------|
| `GET /reports/overview` | `period`, `channel`, `organization_id` | Renvoie les indicateurs agreges (CA, impayes, stocks...) | Objet `{ mtd_revenue: number, unpaid_total: number, active_products: number, low_stock_count: number, conversion_rate?: number, avg_invoice_value?: number }` |
| `GET /reports/sales_by_month` | idem | Serie temporelle des ventes sur la periode selectionnee | Tableau `[{ month: string, revenue: number }]` |
| `GET /reports/top_products` | idem | Classement des meilleurs produits | Tableau `[{ name: string, revenue: number }]` |
| `GET /reports/invoice_status_split` | idem | Repartition des statuts de factures | Tableau `[{ status: string, value: number }]` |

Notes :
- `period` vaut l'une de `7d`, `30d`, `quarter`, `year`.
- `channel` peut etre `all`, `pos`, `online`, `whatsapp`.
- `organization_id` correspond a l'ID interne ; le header `X-Org` est egalement positionne cote frontend.
- Les endpoints doivent tolerer l'absence de donnees (retourner un tableau vide plutot qu'une erreur).
- Pour l'export CSV, le frontend se contente d'agreger la reponse `overview` (aucun endpoint dedie requis).
