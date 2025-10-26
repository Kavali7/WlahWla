# Components Cheatsheet - Tokens v1

Ce guide resume l usage des design tokens introduits pour harmoniser les composants React.

## Tokens Tailwind
- `bg-primary`, `text-primary-foreground` : bouton principal, liens hero.
- `bg-surface-card`, `border-surface-outline` : cartes, panneaux dashboards.
- `shadow-elevated`, `shadow-floating` : niveau d elevation (cards, overlays).
- `rounded-hero`, `rounded-3xl`, `rounded-pill` : pour heros, cards, tabs.
- `bg-gradient-hero`, `bg-gradient-overlay` : fonds hero et overlays media.
- Spaces semantiques : `space-y-13`, `py-section`, `px-gutter` pour rythmer les sections.

## Variables CSS (src/theme/tokens.css)
- `--wl-gradient-hero` : degrade principal hero.
- `--wl-overlay-strong` et `--wl-overlay-soft` : superposition sur images/videos.
- `--wl-surface-card`, `--wl-surface-card-border(-strong)` : surfaces cartes sombres.
- `--wl-surface-badge` : fond badge neutre translucide.
- `--wl-focus-ring` : couleur des anneaux de focus.
- Classes utilitaires fournies : `.wl-hero-gradient`, `.wl-card-glow`, `.wl-overlay-strong`, `.wl-overlay-soft`.

## Bouton
```tsx
import { Button } from '@/components/Button'

export const Actions = () => (
  <div className="flex gap-3">
    <Button variant="primary">Essai gratuit</Button>
    <Button variant="secondary">Demander une demo</Button>
    <Button variant="outline">Voir la documentation</Button>
  </div>
)
```
- `variant="primary"` : `bg-primary`, `shadow-floating`, focus `ring-primary`.
- `variant="secondary"` : `bg-surface`, `border-surface-outline`, texte `secondary-600`.
- `variant="outline"` : hover degrade, highlight accent.

## Carte
```tsx
import { Card } from '@/components/Card'

export const RevenueCard = () => (
  <Card
    title="Performance commerciale"
    description="Suivi temps reel par filiale"
    actions={<Button variant="ghost">Exporter</Button>}
  >
    <div className="text-4xl font-semibold text-primary-200">42,5 M F CFA</div>
    <p className="text-neutral-300">+18 % vs mois precedent</p>
  </Card>
)
```
- Utilise `.card` (surface sombre, `shadow-elevated`, rayon `rounded-3xl`).
- Texte secondaire en `text-neutral-300` pour contraste doux.

## Badge
```tsx
import { Badge } from '@/components/Badge'

export const StatusBadges = () => (
  <div className="flex flex-wrap gap-2">
    <Badge variant="info">Campagne active</Badge>
    <Badge variant="success">Paiement valide</Badge>
    <Badge variant="warning">Signature requise</Badge>
    <Badge variant="danger">Action critique</Badge>
  </div>
)
```
- Mode `soft` par defaut (`bg-success/10`, `border-success/40`).
- Passer `soft={false}` pour badges pleins (fond = couleur semantique).

## Tabs
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs'

export const DashboardTabs = () => (
  <Tabs defaultValue="overview">
    <TabsList>
      <TabsTrigger value="overview">Vue generale</TabsTrigger>
      <TabsTrigger value="sales">Ventes</TabsTrigger>
      <TabsTrigger value="ads">Campagnes</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">Contenu vue generale</TabsContent>
    <TabsContent value="sales">Contenu ventes</TabsContent>
    <TabsContent value="ads">Contenu campagnes</TabsContent>
  </Tabs>
)
```
- Liste : `rounded-pill`, fond `bg-surface-subtle`, blur pour effet verre.
- Onglet actif : `bg-surface`, `shadow-floating`, texte `secondary-700`.
- Contenu : `border-surface-outline`, `shadow-floating`, rayon `rounded-3xl`.

## Captures
- Ajouter captures ou exports Figma dans `docs/branding/assets/` une fois les maquettes stabilisees.
