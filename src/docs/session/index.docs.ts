/**
 * @swagger
 * components:
 *   responses:
 *     UserRegisterResponse:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 $ref: '#/components/schemas/User'
 *               token:
 *                 type: string
 *             required:
 *               - user
 *               - token
 */
