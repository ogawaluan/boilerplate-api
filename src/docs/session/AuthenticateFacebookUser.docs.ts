/**
 * @swagger
 * /login-facebook:
 *   post:
 *     tags:
 *       - Session
 *     summary: Social login with Facebook
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               facebookId:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               facebookImage:
 *                 type: string
 *             required:
 *               - facebookId
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserRegisterResponse'
 */
