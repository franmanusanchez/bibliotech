/**
 * @file category_routes.js
 * @brief Rutas de la API para el catálogo de categorías.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_controller');
const { verifyToken } = require('../middleware/auth_middleware');

/**
 * @brief Ruta protegida: se exige sesión activa.
 * @note Decisión técnica: las categorías solo se usan dentro de pantallas que
 * ya requieren login (el dashboard), y el resto de la API de documentos también
 * es privada. Exponerlas públicamente no aporta nada y amplía la superficie
 * de ataque sin necesidad. api_service.js inyecta el JWT automáticamente.
 */
router.use(verifyToken);

/**
 * @route GET /api/categories
 * @brief Obtener el listado completo de categorías.
 */
router.get('/', categoryController.getAllCategories);

module.exports = router;