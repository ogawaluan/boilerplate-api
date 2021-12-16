/**
 * @swagger
 * /users/validate-credentials:
 *   post:
 *     tags:
 *       - Users
 *     summary: Check if given credentials are available
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 emailAvailable:
 *                   type: boolean
 *               required:
 *                 - emailAvailable
 */
