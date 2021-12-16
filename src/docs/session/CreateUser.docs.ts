/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Session
 *     summary: Register user with email
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         $ref: '#/components/responses/UserRegisterResponse'
 */
