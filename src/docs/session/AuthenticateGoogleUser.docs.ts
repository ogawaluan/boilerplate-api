/**
 * @swagger
 * /login-google:
 *   post:
 *     tags:
 *       - Session
 *     summary: Social login with Google
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               googleId:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               googleImage:
 *                 type: string
 *             required:
 *               - googleId
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserRegisterResponse'
 */
