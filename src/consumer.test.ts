import nock, { cleanAll } from 'nock'
import {
  getMovies,
  getMovieById,
  getMovieByName,
  addMovie,
  deleteMovieById,
  updateMovie
} from './consumer'
import type { Movie, ErrorResponse } from './consumer'
import type {
  DeleteMovieResponse,
  GetMovieResponse
} from './provider-schema/movie-types'

const MOCKSERVER_URL = 'http://mockserver.com'

describe('Consumer API functions', () => {
  afterEach(() => {
    cleanAll()
  })

  describe('getMovies, getMovieByName', () => {
    it('should return all movies', async () => {
      const EXPECTED_BODY: Movie = {
        id: 1,
        name: 'My movie',
        year: 1999,
        rating: 8.5
      }

      nock(MOCKSERVER_URL)
        .get('/movies')
        .reply(200, { status: 200, data: [EXPECTED_BODY] })

      const res = await getMovies(MOCKSERVER_URL)
      expect(res.data).toEqual([EXPECTED_BODY])
    })

    it('should handle errors correctly', async () => {
      const errorRes: ErrorResponse = { error: 'Not found' }
      nock(MOCKSERVER_URL).get('/movies').reply(404, errorRes)

      const res = await getMovies(MOCKSERVER_URL)
      expect(res).toEqual(errorRes)
    })

    it('should return a specific movie by name', async () => {
      const EXPECTED_BODY: Movie = {
        id: 1,
        name: 'My movie',
        year: 1999,
        rating: 8.5
      }

      nock(MOCKSERVER_URL)
        .get(`/movies?name=${EXPECTED_BODY.name}`)
        .reply(200, { status: 200, data: EXPECTED_BODY })

      const res = (await getMovieByName(
        MOCKSERVER_URL,
        EXPECTED_BODY.name
      )) as GetMovieResponse
      expect(res.data).toEqual(EXPECTED_BODY)
    })

    it('should handle errors correctly', async () => {
      const errorRes: ErrorResponse = { error: 'Not found' }
      nock(MOCKSERVER_URL).get('/movies?name=My%20movie').reply(404, errorRes)

      const res = await getMovieByName(MOCKSERVER_URL, 'My movie')
      expect(res).toEqual(errorRes)
    })
  })

  describe('getMovieById', () => {
    it('should return a specific movie by ID', async () => {
      const EXPECTED_BODY: Movie = {
        id: 1,
        name: 'My movie',
        year: 1999,
        rating: 8.5
      }

      nock(MOCKSERVER_URL)
        .get(`/movies/${EXPECTED_BODY.id}`)
        .reply(200, { status: 200, data: EXPECTED_BODY })

      const res = (await getMovieById(
        MOCKSERVER_URL,
        EXPECTED_BODY.id
      )) as GetMovieResponse
      expect(res.data).toEqual(EXPECTED_BODY)
    })

    it('should handle errors when movie not found', async () => {
      const testId = 999
      const errorRes: ErrorResponse = { error: 'Movie not found' }
      nock(MOCKSERVER_URL).get(`/movies/${testId}`).reply(404, errorRes)

      const result = await getMovieById(MOCKSERVER_URL, testId)
      expect(result).toEqual(errorRes)
    })
  })

  describe('addMovie', () => {
    const movie: Omit<Movie, 'id'> = {
      name: 'New movie',
      year: 1999,
      rating: 8.5
    }
    it('should add a new movie', async () => {
      nock(MOCKSERVER_URL)
        .post('/movies', movie)
        .reply(200, {
          status: 200,
          data: { ...movie, id: 1 }
        })

      const res = await addMovie(MOCKSERVER_URL, movie)
      expect(res).toEqual({
        status: 200,
        data: {
          id: 1,
          ...movie
        }
      })
    })

    it('should not add a movie that already exists', async () => {
      const errorRes: ErrorResponse = {
        error: `Movie ${movie.name} already exists`
      }

      nock(MOCKSERVER_URL).post('/movies', movie).reply(409, errorRes)

      const res = await addMovie(MOCKSERVER_URL, movie)
      expect(res).toEqual(errorRes)
    })
  })

  describe('updateMovie', () => {
    const updatedMovieData = {
      name: 'Updated movie',
      year: 2000,
      rating: 8.5
    }
    it('should update an existing movie successfully', async () => {
      const testId = 1

      const EXPECTED_BODY: Movie = {
        id: testId,
        ...updatedMovieData
      }

      nock(MOCKSERVER_URL)
        .put(`/movies/${testId}`, updatedMovieData)
        .reply(200, { status: 200, data: EXPECTED_BODY })

      const res = await updateMovie(MOCKSERVER_URL, testId, updatedMovieData)
      expect(res).toEqual({
        status: 200,
        data: EXPECTED_BODY
      })
    })

    it('should return an error if moive to update does not exist', async () => {
      const testId = 999

      const errorRes: ErrorResponse = {
        error: `Movie with ID ${testId} not found`
      }

      nock(MOCKSERVER_URL)
        .put(`/movies/${testId}`, updatedMovieData)
        .reply(404, errorRes)

      const res = await updateMovie(MOCKSERVER_URL, testId, updatedMovieData)
      expect(res).toEqual(errorRes)
    })
  })

  describe('deleteMovieById', () => {
    it('should delete an existing movie successfully', async () => {
      const testId = 100
      const message = `Movie ${testId} has been deleted`

      nock(MOCKSERVER_URL)
        .delete(`/movies/${testId}`)
        .reply(200, { message, status: 200 })

      const res = (await deleteMovieById(
        MOCKSERVER_URL,
        testId
      )) as DeleteMovieResponse
      expect(res.message).toEqual(message)
    })

    it('should throw an error if movie to delete does not exist', async () => {
      const testId = 123456789
      const message = `Movie with ID ${testId} not found`

      nock(MOCKSERVER_URL)
        .delete(`/movies/${testId}`)
        .reply(404, { message, status: 404 })

      const res = (await deleteMovieById(
        MOCKSERVER_URL,
        testId
      )) as DeleteMovieResponse
      expect(res.message).toEqual(message)
    })
  })
})
