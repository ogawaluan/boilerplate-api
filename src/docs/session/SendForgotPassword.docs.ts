/**
 * @swagger
 * /forgot-password:
 *   post:
 *     tags:
 *       - Session
 *     summary: Generate a temporary password for the user and send an email with it
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       204:
 *         description:
 */
