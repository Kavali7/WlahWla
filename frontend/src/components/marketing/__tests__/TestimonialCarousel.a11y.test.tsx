import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { TestimonialCarousel } from '../TestimonialCarousel'
import { homeTestimonials } from '@/content/home/testimonials'

const renderCarousel = () =>
  render(
    <MemoryRouter>
      <TestimonialCarousel testimonials={homeTestimonials} autoPlay={false} />
    </MemoryRouter>,
  )

describe('TestimonialCarousel accessibility', () => {
  test('supports keyboard tab order and pause toggle', async () => {
    renderCarousel()

    const pauseButton = screen.getByRole('button', { name: 'Mettre en pause l auto play des temoignages' })
    const prevButton = screen.getByRole('button', { name: 'Diapositive precedente' })
    const nextButton = screen.getByRole('button', { name: 'Diapositive suivante' })
    const firstDot = screen.getByRole('button', { name: 'Afficher le temoignage Maison Ndar Boutique' })

    pauseButton.focus()
    expect(pauseButton).toHaveFocus()

    await userEvent.tab()
    const detailLink = screen.getByRole('link', { name: 'Lire le cas complet ->' })
    expect(detailLink).toHaveFocus()

    await userEvent.tab()
    expect(prevButton).toHaveFocus()

    await userEvent.tab()
    expect(nextButton).toHaveFocus()

    await userEvent.tab()
    expect(firstDot).toHaveFocus()

    await userEvent.tab({ shift: true })
    expect(nextButton).toHaveFocus()

    await userEvent.tab({ shift: true })
    expect(prevButton).toHaveFocus()

    await userEvent.tab({ shift: true })
    expect(detailLink).toHaveFocus()

    await userEvent.tab({ shift: true })
    expect(pauseButton).toHaveFocus()

    await userEvent.keyboard('{Space}')
    await waitFor(() => expect(pauseButton).toHaveAttribute('aria-pressed', 'true'))

    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(pauseButton).toHaveAttribute('aria-pressed', 'false'))
  })

  test('handles arrow key navigation and exposes slide labels', async () => {
    renderCarousel()

    const pauseButton = screen.getByRole('button', { name: 'Mettre en pause l auto play des temoignages' })
    pauseButton.focus()

    const firstSlide = screen.getByRole('group', { name: '1 sur 4' })
    expect(firstSlide).toHaveAttribute('aria-hidden', 'false')
    expect(firstSlide).toHaveTextContent('Maison Ndar Boutique')

    await userEvent.keyboard('{ArrowRight}')
    const secondSlide = screen.getByRole('group', { name: '2 sur 4' })
    expect(secondSlide).toHaveAttribute('aria-hidden', 'false')
    expect(secondSlide).toHaveTextContent('Studio Latitude')

    await userEvent.keyboard('{ArrowLeft}')
    expect(firstSlide).toHaveAttribute('aria-hidden', 'false')
  })
})
