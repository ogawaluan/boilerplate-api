/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Ping server
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 version:
 *                   type: string
 *                 description:
 *                   type: string
 *               required:
 *                 - name
 *                 - version
 *                 - description
 */
