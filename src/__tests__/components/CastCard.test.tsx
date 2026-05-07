import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CastCard from '../../components/movie/CastCard'
import type { Cast } from '../../types/movie.types'

const mockCast: Cast = {
  id: 201,
  name: 'Actor One',
  character: 'The Hero',
  profile_path: '/actor1.jpg',
  order: 0,
}

describe('CastCard', () => {
  it('renders the actor name', () => {
    render(<CastCard member={mockCast} />)
    expect(screen.getByText('Actor One')).toBeInTheDocument()
  })

  it('renders the character name', () => {
    render(<CastCard member={mockCast} />)
    expect(screen.getByText('The Hero')).toBeInTheDocument()
  })

  it('renders a profile image with the actor name as alt text', () => {
    render(<CastCard member={mockCast} />)
    const img = screen.getByAltText('Actor One')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', expect.stringContaining('/actor1.jpg'))
  })

  it('renders no image when profile_path is null', () => {
    render(<CastCard member={{ ...mockCast, profile_path: null }} />)
    expect(screen.queryByAltText('Actor One')).not.toBeInTheDocument()
  })

  it('renders placeholder div when profile_path is null', () => {
    const { container } = render(<CastCard member={{ ...mockCast, profile_path: null }} />)
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('.bg-zinc-800')).toBeTruthy()
  })
})
