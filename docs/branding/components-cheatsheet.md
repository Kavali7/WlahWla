# Components Cheatsheet - Tokens v1

Ce guide resume l usage des design tokens introduits pour harmoniser les composants React.

## Tokens Tailwind
- `bg-primary`, `text-primary-foreground` : bouton principal, liens hero.
- `bg-surface-card`, `border-surface-outline` : cartes, panneaux dashboards.
- `shadow-elevated`, `shadow-floating`, `shadow-service` : niveau d elevation (cards marketing et overlays).
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

## HeroCarousel
```tsx
import { HeroCarousel } from '@/components/media/HeroCarousel'
import { heroSlides } from '@/content/hero-slides'

export const HeroSection = () => <HeroCarousel slides={heroSlides} autoPlayInterval={7000} />
```
- Utilise les assets `public/assets/brand/hero-*.svg` et tokens `rounded-hero`, `bg-gradient-card-glow`.
- Les slides combinent metrics + CTA; definir dans `src/content/hero-slides.ts`.
- `loading` bascule en `eager` sur la diapo active pour eviter le flash.

## AdvertisingCard
```tsx
import { AdvertisingCard } from '@/components/marketing/AdvertisingCard'
import { advertisingSpots } from '@/content/advertising-spots'

export const CampaignGrid = () => (
  <div className="grid gap-6 md:grid-cols-2">
    {advertisingSpots.map((spot) => (
      <AdvertisingCard key={spot.id} {...spot} />
    ))}
  </div>
)
```
- Propose une mise en page 2 colonnes avec image responsive (lazy) + stats.
- Le badge et les stats sont optionnels; conserver au moins `badge`, `title`, `description`, `image`.
- Ideal pour pages marketing, modules cross sell et landing ads.

## ServiceCard
```tsx
import { ServiceCard } from '@/components/marketing/ServiceCard'
import { services } from '@/content/home/services'

export const ServicesGrid = () => (
  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
    {services.map((service) => (
      <ServiceCard key={service.id} {...service} />
    ))}
  </div>
)
```
- Icone circulaire avec halo accent `#5864FF`, hover translate `-translate-y-2`.
- Fond `bg-white`, bord `border-surface-outline`, ombre `shadow-service` -> `shadow-elevated` sur hover.
- CTA texte `Link` interne avec fleche `->`, bullets formats `flex` pour alignement.
- Utilise `services.ts` pour centraliser titres, resumes, puces et CTA valides marketing.

## VerticalCard
```tsx
import { VerticalCard } from '@/components/marketing/VerticalCard'
import { verticalPreviews } from '@/content/home/verticals'

export const VerticalGrid = () => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
    {verticalPreviews.map((vertical) => (
      <VerticalCard key={vertical.id} {...vertical} />
    ))}
  </div>
)
```
- Fond clair `bg-surface-subtle`, halo primaire et hover `shadow-elevated`.
- Icone circulaire derivee de la verticale (`retail`, `accounting`, `services`, `agencies`).
- Puces orientees resultat (3 maximum) et CTA vers `/verticals/:slug`.

## VerticalLayout
```tsx
import { VerticalLayout } from '@/pages/verticals/VerticalLayout'
import { verticalsBySlug } from '@/content/verticals'

export const RetailVertical = () => <VerticalLayout vertical={verticalsBySlug.retail} />
```
- Hero combine badge, metrics et double CTA primaire/secondaire.
- Blocs promesse en grille 3 colonnes, parcours types en cartes blanches, temoignages en bandeau clair.
- Section ressources conclut la page avec rappel CTA principal et liens internes (ressources, support).
- Les contenus sont fournis depuis `src/content/verticals/*.ts` et agreges via `verticalsBySlug`.

## Captures
- Ajouter captures ou exports Figma dans `docs/branding/assets/` une fois les maquettes stabilisees.
- Executer `npm run optimize:images` apres ajout d images pour minifier les ressources web.
