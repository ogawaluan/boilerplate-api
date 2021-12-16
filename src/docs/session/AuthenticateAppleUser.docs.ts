/**
 * @swagger
 * /login-apple:
 *   post:
 *     tags:
 *       - Session
 *     summary: Social login with Apple
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appleToken:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - appleToken
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserRegisterResponse'
 */
