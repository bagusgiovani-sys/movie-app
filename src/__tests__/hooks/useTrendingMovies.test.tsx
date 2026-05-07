import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useTrendingMovies } from '../../hooks/useTrendingMovies'
import { getTrendingMovies } from '../../services'
import type { Movie } from '../../types/movie.types'

vi.mock('../../services', () => ({
  getTrendingMovies: vi.fn(),
}))

const mockMovie: Movie = {
  id: 1001, title: 'Trending Movie', poster_path: '/t.jpg', backdrop_path: null,
  overview: 'Overview', release_date: '2026-01-01', vote_average: 8.0,
  vote_count: 500, genre_ids: [28], popularity: 200, original_language: 'en',
  original_title: 'Trending Movie', adult: false,
}

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useTrendingMovies', () => {
  beforeEach(() => {
    vi.mocked(getTrendingMovies).mockResolvedValue([mockMovie])
  })

  it('calls getTrendingMovies on mount', async () => {
    renderHook(() => useTrendingMovies(), { wrapper: makeWrapper() })
    await waitFor(() => expect(getTrendingMovies).toHaveBeenCalledOnce())
  })

  it('returns the data from the service', async () => {
    const { result } = renderHook(() => useTrendingMovies(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data![0].id).toBe(1001)
  })
})
