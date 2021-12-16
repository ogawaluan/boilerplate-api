/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   parameters:
 *     pageParam:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         minimum: 1
 *         default: 1
 *     limitParam:
 *       in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 1000
 *         default: 10
 *     sortParam:
 *       in: query
 *       name: sort
 *       schema:
 *         type: string
 *         default: 'createdAt'
 *     directionParam:
 *       in: query
 *       name: direction
 *       schema:
 *         type: string
 *         enum:
 *           - 'asc'
 *           - 'desc'
 *         default: 'asc'
 *   schemas:
 *     BasePaginationObject:
 *       type: object
 *       properties:
 *         previous:
 *           type: integer
 *         hasPrevious:
 *           type: boolean
 *         current:
 *           type: number
 *         next:
 *           type: integer
 *         hasNext:
 *           type: boolean
 *         total:
 *           type: number
 *         limit:
 *           type: number
 *       required:
 *         - hasPrevious
 *         - current
 *         - hasNext
 *         - total
 *         - limit
 */
