/**
 * @file category_repository.js
 * @brief Repositorio para la capa de acceso a datos de categorías.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

const db = require('../config/db');

/**
 * @class CategoryRepository
 * @brief Encapsula las llamadas a Stored Procedures del catálogo de categorías.
 */
class CategoryRepository
{
    /**
     * @brief Obtiene todas las categorías disponibles.
     * @returns {Promise<Array>} Array de objetos { id, name } ordenados alfabéticamente.
     *
     * @note El acceso es paramétrico y exclusivamente vía Stored Procedure, igual que
     * el resto de los repositorios: la capa de datos nunca arma SQL inline.
     */
    async findAll()
    {
        const [rows] = await db.execute('CALL sp_get_all_categories()');
        return rows[0];
    }
}

module.exports = new CategoryRepository();