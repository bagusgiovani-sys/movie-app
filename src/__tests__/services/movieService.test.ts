import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '../../lib/api'
import { getMovieVideos } from '../../services/movie.service'

vi.mock('../../lib/api', () => ({
  api: { get: vi.fn() },
  default: { get: vi.fn() },
}))

const allVideos = {
  data: {
    id: 1001,
    results: [
      { id: 'v1', key: 'key1', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true, published_at: '2026-01-01T00:00:00.000Z' },
      { id: 'v2', key: 'key2', name: 'Teaser', site: 'YouTube', type: 'Teaser', official: false, published_at: '2026-01-01T00:00:00.000Z' },
      { id: 'v3', key: 'key3', name: 'Vimeo Trailer', site: 'Vimeo', type: 'Trailer', official: false, published_at: '2026-01-01T00:00:00.000Z' },
    ],
  },
}

describe('getMovieVideos', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockResolvedValue(allVideos)
  })

  it('returns only YouTube trailers', async () => {
    const result = await getMovieVideos('1001')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('v1')
  })

  it('filters out non-Trailer types (teasers, clips)', async () => {
    const result = await getMovieVideos('1001')
    expect(result.every((v) => v.type === 'Trailer')).toBe(true)
  })

  it('filters out non-YouTube entries', async () => {
    const result = await getMovieVideos('1001')
    expect(result.every((v) => v.site === 'YouTube')).toBe(true)
  })

  it('returns empty array when no videos match the filter', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        id: 1001,
        results: [
          { id: 'v2', key: 'key2', name: 'Teaser', site: 'YouTube', type: 'Teaser', official: false, published_at: '2026-01-01T00:00:00.000Z' },
          { id: 'v3', key: 'key3', name: 'Vimeo Trailer', site: 'Vimeo', type: 'Trailer', official: false, published_at: '2026-01-01T00:00:00.000Z' },
        ],
      },
    })
    const result = await getMovieVideos('1001')
    expect(result).toHaveLength(0)
  })
})
