import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MovieCard from '../../components/movie/MovieCard'
import type { Movie } from '../../types/movie.types'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockMovie: Movie = {
  id: 1001,
  title: 'Test Movie',
  poster_path: '/test.jpg',
  backdrop_path: null,
  overview: 'Test overview',
  release_date: '2026-01-01',
  vote_average: 7.5,
  vote_count: 500,
  genre_ids: [28],
  popularity: 100,
  original_language: 'en',
  original_title: 'Test Movie',
  adult: false,
}

function renderCard(movie = mockMovie) {
  return render(
    <MemoryRouter>
      <MovieCard movie={movie} />
    </MemoryRouter>
  )
}

describe('MovieCard', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the movie title', () => {
    renderCard()
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })

  it('renders the vote average formatted as x.x/10', () => {
    renderCard()
    expect(screen.getByText('7.5/10')).toBeInTheDocument()
  })

  it('renders the poster image with the movie title as alt text', () => {
    renderCard()
    expect(screen.getByAltText('Test Movie')).toBeInTheDocument()
  })

  it('renders No Image placeholder when poster_path is null', () => {
    renderCard({ ...mockMovie, poster_path: null })
    expect(screen.getByText('No Image')).toBeInTheDocument()
  })

  it('navigates to /movie/:id when clicked', () => {
    renderCard()
    fireEvent.click(screen.getByText('Test Movie'))
    expect(mockNavigate).toHaveBeenCalledWith('/movie/1001')
  })
})
