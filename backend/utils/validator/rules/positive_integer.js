/**
 * @file positive_integer.js
 * @brief Regla de validación: Número entero estrictamente positivo (> 0).
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

class PositiveInteger
{
    /**
     * @param {string} messageName - Clave del diccionario de traducciones.
     */
    constructor(messageName = "CT_POSITIVE_INTEGER")
    {
        this._messageName = messageName;
        this.validator = null; // Será inyectado por el Patrón Visitor
    }

    /**
     * @brief Evalúa que el valor sea un entero positivo escrito solo con dígitos.
     * @note Se usa una expresión regular en lugar de Number() porque los datos de un
     * formulario multipart llegan siempre como string, y Number() aceptaría
     * decimales ("1.5") y notación científica ("1e2"), que no son ids válidos.
     */
    evaluate(target)
    {
        return /^[1-9][0-9]*$/.test(String(target).trim());
    }

    validate(target)
    {
        if (!this.evaluate(target))
        {
            const message = this.validator.i18n.getMessage(this._messageName);
            throw new Error(message);
        }
    }
}
module.exports = PositiveInteger;