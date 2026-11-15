/**
 * @file category_controller.js
 * @brief Controlador para la consulta del catálogo de categorías.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

const categoryRepository = require('../repositories/category_repository');

/**
 * @class CategoryController
 * @brief Expone el catálogo de categorías a los clientes de la API.
 */
class CategoryController
{
    /**
     * @brief Lista todas las categorías disponibles.
     * @param {Object} req - Petición HTTP.
     * @param {Object} res - Respuesta HTTP.
     * @param {Function} next - Función para delegar errores al Global Error Handler.
     *
     * @note No se responde con res.status(500) en el catch: cualquier fallo se
     * delega con next(error) para que global_error_middleware lo traduzca.
     */
    async getAllCategories(req, res, next)
    {
        try
        {
            const categories = await categoryRepository.findAll();
            res.json(categories);
        }
        catch (error)
        {
            next(error);
        }
    }
}

module.exports = new CategoryController();