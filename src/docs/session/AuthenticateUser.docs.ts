/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Session
 *     summary: Login with email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserRegisterResponse'
 */
