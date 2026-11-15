/**
 * @file ui_handlers.js
 * @brief Componentes de interfaz gráfica dinámica construidos en memoria (Zero innerHTML).
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @brief Construye y muestra una ventana de diálogo modal informativa.
 * @details Manipulación estricta del DOM: Al usar document.createElement() y textContent, 
 * blindamos la aplicación contra inyección de código (XSS). El texto se renderiza como 
 * dato puro, nunca como HTML ejecutable.
 * @param {string} title - Título del cuadro de diálogo.
 * @param {string} message - Mensaje o cuerpo de la alerta.
 */
 function showModal(title, message) 
 {
     let modal = document.getElementById('msgModal');
 
     // Patrón Singleton aplicado al DOM: Solo creamos los elementos si no existen previamente
     if (!modal) 
     {
         modal = document.createElement('div');
         modal.id = 'msgModal';
         modal.className = 'w3-modal';
 
         const content = document.createElement('div');
         content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
         content.style.maxWidth = '400px';
 
         const header = document.createElement('header');
         header.className = 'w3-container w3-border-bottom';
 
         const titleElem = document.createElement('h3');
         titleElem.id = 'modalTitle';
         header.appendChild(titleElem);
 
         const bodyDiv = document.createElement('div');
         bodyDiv.className = 'w3-container w3-padding';
 
         const msgElem = document.createElement('p');
         msgElem.id = 'modalBody';
         
         const btnClose = document.createElement('button');
         btnClose.className = 'w3-button w3-right w3-teal w3-margin-bottom'; 
         btnClose.textContent = 'Cerrar';
         
         // Asignación de eventos mediante Listeners (más limpio que usar el atributo onclick en HTML)
         btnClose.addEventListener('click', () => 
         {
             modal.style.display = 'none';
         });
 
         // Ensamblaje del árbol DOM: De adentro hacia afuera
         bodyDiv.appendChild(msgElem);
         bodyDiv.appendChild(btnClose);
         content.appendChild(header);
         content.appendChild(bodyDiv);
         modal.appendChild(content);
         document.body.appendChild(modal);
     }
 
     // Actualizamos el contenido dinámico reutilizando los nodos existentes
     document.getElementById('modalTitle').textContent = title;
     document.getElementById('modalBody').textContent = message;
     modal.style.display = 'block';
 }
 
 /**
  * @brief Muestra una ventana modal conteniendo un visor de PDF interactivo.
  * @param {string} title - Título del documento.
  * @param {string} pdfUrl - Ruta física del archivo en el servidor.
  */
 function showPdfModal(title, pdfUrl) 
 {
     let modal = document.getElementById('pdfModal');
 
     if (!modal) 
     {
         modal = document.createElement('div');
         modal.id = 'pdfModal';
         modal.className = 'w3-modal';
         modal.style.zIndex = '9999';
 
         const content = document.createElement('div');
         content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
         content.style.width = '85%';
         content.style.maxWidth = '950px';
 
         const header = document.createElement('header');
         header.className = 'w3-container w3-border-bottom w3-padding w3-display-container';
 
         const titleElem = document.createElement('h3');
         titleElem.id = 'pdfModalTitle';
         titleElem.className = 'w3-margin-0 w3-text-teal';
         header.appendChild(titleElem);
 
         // Botón de cerrar posicionado absolutamente. 
         // Zero-innerHTML: Usamos el carácter Unicode '×' nativo en textContent.
         const btnCloseHeader = document.createElement('span');
         btnCloseHeader.className = 'w3-button w3-display-topright w3-hover-red';
         btnCloseHeader.textContent = '×'; 
         btnCloseHeader.style.fontSize = '24px';
         btnCloseHeader.addEventListener('click', () => 
         {
             modal.style.display = 'none';
             const iframe = document.getElementById('pdfIframe');
             // Al vaciar el src, detenemos la descarga en segundo plano del PDF
             if (iframe) 
             {
                 iframe.src = '';
             }
         });
         header.appendChild(btnCloseHeader);
 
         const bodyDiv = document.createElement('div');
         bodyDiv.className = 'w3-container w3-padding-0';
 
         const iframe = document.createElement('iframe');
         iframe.id = 'pdfIframe';
         iframe.style.width = '100%';
         iframe.style.height = '75vh';
         iframe.style.border = 'none';
         
         bodyDiv.appendChild(iframe);
         content.appendChild(header);
         content.appendChild(bodyDiv);
         modal.appendChild(content);
         document.body.appendChild(modal);
     }
 
     document.getElementById('pdfModalTitle').textContent = title;
     document.getElementById('pdfIframe').src = pdfUrl;
     modal.style.display = 'block';
 }

 /**
 * @brief Construye dinámicamente la ventana modal para editar metadatos.
 * @details Manipulación estricta del DOM (Zero-innerHTML) para prevenir Cross-Site Scripting (XSS).
 * 
 * @param {Object} book Objeto con los datos actuales del libro seleccionado.
 * @param {Function} onSave Función Callback (asincrónica) que se ejecutará al guardar.
 */
function showEditModal(book,categories, onSave) 
{
    let modal = document.getElementById('editModal');

    // Patrón Singleton: Solo armamos todo el árbol HTML si el modal no existe previamente
    if (!modal) 
    {
        modal = document.createElement('div');
        modal.id = 'editModal';
        modal.className = 'w3-modal';
        modal.style.zIndex = '9999';

        const content = document.createElement('div');
        content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
        content.style.maxWidth = '500px';

        const header = document.createElement('header');
        header.className = 'w3-container w3-border-bottom w3-padding';
        
        const titleElem = document.createElement('h3');
        titleElem.textContent = 'Editar Metadatos del Documento';
        titleElem.className = 'w3-margin-0 w3-text-teal';
        header.appendChild(titleElem);

        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'w3-container w3-padding';

        // Función de utilidad interna para no repetir código al crear los 4 inputs
        const createInput = (id, labelText, type = 'text') => {
            const label = document.createElement('label');
            label.textContent = labelText;
            label.className = 'w3-text-teal';
            
            const input = document.createElement('input');
            input.id = id;
            input.type = type;
            input.className = 'w3-input w3-border w3-round w3-margin-bottom';
            
            bodyDiv.appendChild(label);
            bodyDiv.appendChild(input);
        };

        createInput('editTitle', 'Título');
        createInput('editAuthor', 'Autor');


        // La categoría es un <select> y no un input libre: el usuario solo puede
        // elegir ids que existen en la base 
        const categoryLabel = document.createElement('label');
        categoryLabel.textContent = 'Categoría';
        categoryLabel.className = 'w3-text-teal';

        const categorySelect = document.createElement('select');
        categorySelect.id = 'editCategory';
        categorySelect.className = 'w3-select w3-border w3-round w3-margin-bottom';

        bodyDiv.appendChild(categoryLabel);
        bodyDiv.appendChild(categorySelect);


        createInput('editPages', 'Páginas', 'number');

        const footerDiv = document.createElement('div');
        footerDiv.className = 'w3-container w3-padding-16 w3-light-grey w3-border-top';

        const btnSave = document.createElement('button');
        btnSave.id = 'btnSaveEdit';
        btnSave.className = 'w3-button w3-right w3-teal w3-round';
        btnSave.textContent = 'Guardar Cambios';

        const btnCancel = document.createElement('button');
        btnCancel.className = 'w3-button w3-right w3-dark-grey w3-round w3-margin-right';
        btnCancel.textContent = 'Cancelar';
        btnCancel.addEventListener('click', () => { 
            modal.style.display = 'none'; 
        });

        footerDiv.appendChild(btnSave);
        footerDiv.appendChild(btnCancel);

        // Ensamblaje final de las "cajas" HTML
        content.append(header, bodyDiv, footerDiv);
        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    // 1. Cargar los datos actuales del libro en los inputs para que el usuario los vea
    document.getElementById('editTitle').value = book.title;
    document.getElementById('editAuthor').value = book.author;



    // Las opciones se reconstruyen cada vez que se abre el modal (el modal es un
    // Singleton y la lista puede haber cambiado). Zero-innerHTML: createElement + textContent.
    const categorySelect = document.getElementById('editCategory');
    categorySelect.replaceChildren();
    categories.forEach(c => 
    {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        categorySelect.appendChild(option);
    });
    categorySelect.value = book.category_id;



    document.getElementById('editPages').value = book.pages;

    // 2. Limpiar el evento anterior (si el usuario abrió otro libro antes) y asignar el nuevo
    const btnSave = document.getElementById('btnSaveEdit');
    btnSave.onclick = async () => 
    {
        btnSave.disabled = true; // Desactivar botón para evitar doble clic
        
        const updatedData = {
            title: document.getElementById('editTitle').value,
            author: document.getElementById('editAuthor').value,
            category_id: document.getElementById('editCategory').value,
            pages: document.getElementById('editPages').value
        };
        
        // Ejecuta la orden de guardado que le va a mandar el Controlador Frontend
        await onSave(updatedData); 
        
        modal.style.display = 'none';
        btnSave.disabled = false;
    };

    modal.style.display = 'block'; // Mostrar la ventana
}