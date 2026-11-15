/**
 * @file audit_repository.js
 * @brief Repositorio para la capa de acceso a datos de auditoría y trazabilidad.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

const db = require('../config/db');

/**
 * @class AuditRepository
 * @brief Gestiona la persistencia de eventos críticos mediante Stored Procedures.
 */
class AuditRepository
{
    /**
     * @brief Registra una acción crítica en la tabla audit_logs.
     * @details Invoca de forma asincrónica al procedimiento sp_create_audit_log
     * utilizando Prepared Statements para prevenir ataques de inyección SQL.
     * 
     * @param {number} userId ID del usuario que ejecuta la acción.
     * @param {string} action Código del evento ('DELETE_BOOK' o 'DELETE_USER').
     * @param {string} target Identificador o detalle del recurso eliminado.
     * @returns {Promise<boolean>} Retorna true cuando el registro se guarda en BD.
     */
    async create(userId, action, target)
    {
        await db.execute(
            'CALL sp_create_audit_log(?, ?, ?)',
            [userId, action, target]
        );
        return true;
    }
}

module.exports = new AuditRepository();