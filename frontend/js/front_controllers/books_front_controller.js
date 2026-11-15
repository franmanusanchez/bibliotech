/**
 * @file books_front_controller.js
 * @brief Controlador frontend para gestionar la carga, listado y lectura de documentos.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 document.addEventListener('DOMContentLoaded', loadBooks);

//agregado
document.addEventListener('DOMContentLoaded', loadCategories);

 async function loadBooks() 
 {
     try 
     {
         const books = await apiService.request('/books/my-books', 'GET');
         renderBooksTable(books);
     } 
     catch (error) 
     {
         showModal('Error', 'No se pudieron cargar los documentos: ' + error.message);
     }
 }

 //agregada
 /**
 * @brief Carga las categorías desde la API y las inyecta en el <select>.
 * @note Se usa createElement y textContent (nunca innerHTML) para mantener
 * la política Zero-XSS: el nombre de la categoría viene de la base de datos
 * y se trata siempre como texto plano, no como HTML.
 * @note Es independiente de loadBooks(): si falla una, la otra sigue funcionando.
 */
async function loadCategories()
{
    const select = document.getElementById('category');
    const submitButton = uploadForm ? uploadForm.querySelector('button[type="submit"]') : null;

    try
    {
        const categories = await apiService.request('/categories', 'GET');

        // Se vacía antes de llenar para evitar opciones duplicadas si se recarga
        select.replaceChildren();

        categories.forEach(c =>
        {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name;
            select.appendChild(option);
        });

        // Sin categorías no se puede cargar un libro: se bloquea el envío
        if (submitButton)
        {
            submitButton.disabled = categories.length === 0;
        }
    }
    catch (error)
    {
        if (submitButton)
        {
            submitButton.disabled = true;
        }
        showModal('Error', 'No se pudieron cargar las categorías: ' + error.message);
    }
}
 //aca en adelante original
 function renderBooksTable(books) 
 {
     const tbody = document.getElementById('booksTableBody');
     tbody.replaceChildren();
 
     books.forEach(b => 
     {
         const row = document.createElement('tr');
 
         const tdTitle = document.createElement('td');
         const boldTitle = document.createElement('b');
         boldTitle.textContent = b.title;
         tdTitle.appendChild(boldTitle);
         
         const tdAuthor = document.createElement('td');
         tdAuthor.textContent = b.author;
 
         const tdCategory = document.createElement('td');
         const spanCat = document.createElement('span');
         spanCat.className = 'w3-tag w3-round w3-black';
         spanCat.textContent = b.category;
         tdCategory.appendChild(spanCat);
 
         const tdPages = document.createElement('td');
         tdPages.textContent = b.pages;
 
         const tdReading = document.createElement('td');
         
         const btnView = document.createElement('button');
         btnView.className = 'w3-button w3-teal w3-tiny w3-round w3-margin-right';
         btnView.textContent = 'Visualizar';
         btnView.addEventListener('click', () => 
         {
             showPdfModal(b.title, b.file_path);
         });
         tdReading.appendChild(btnView);
 
         // Uso del atributo nativo 'download' para forzar descarga en lugar de abrir el archivo en el navegador
         const linkDownload = document.createElement('a');
         linkDownload.className = 'w3-button w3-dark-grey w3-tiny w3-round';
         linkDownload.textContent = 'Descargar';
         linkDownload.href = b.file_path;
         linkDownload.setAttribute('download', `${b.title}.pdf`);
         tdReading.appendChild(linkDownload);
 
         const tdActions = document.createElement('td');

         // --- INICIO NUEVO BOTÓN EDITAR ---
         const btnEdit = document.createElement('button');
         btnEdit.className = 'w3-button w3-blue w3-tiny w3-round w3-margin-right';
         btnEdit.textContent = 'Editar';
         btnEdit.addEventListener('click', () => 
         {
             showEditModal(b, async (updatedData) => 
             {
                 try 
                 {
                     await apiService.request(`/books/${b.id}`, 'PUT', updatedData);
                     showModal('Éxito', 'Metadatos actualizados correctamente.');
                     loadBooks(); 
                 } 
                 catch (error)
                 {
                     showModal('Error de Validación', error.message);
                 }
             });
         });
         tdActions.appendChild(btnEdit);
         // --- FIN NUEVO BOTÓN EDITAR ---

         const btnDelete = document.createElement('button');
         btnDelete.className = 'w3-button w3-red w3-tiny w3-round';
         btnDelete.textContent = 'Borrar';
         btnDelete.addEventListener('click', () => 
         {
             deleteBook(b.id);
         });
         
         tdActions.appendChild(btnDelete);
 
         row.append(tdTitle, tdAuthor, tdCategory, tdPages, tdReading, tdActions);
         tbody.appendChild(row);
     });
 }
 
 async function deleteBook(id) 
 {
     if (!confirm('¿Estás seguro de eliminar este documento de tu biblioteca?')) 
     {
         return;
     }
     
     try 
     {
         await apiService.request(`/books/${id}`, 'DELETE');
         showModal('Eliminado', 'El documento ha sido borrado.');
         loadBooks();
     } 
     catch (error) 
     {
         showModal('Error', error.message);
     }
 }
 
 const uploadForm = document.getElementById('uploadForm');
 
 if (uploadForm) 
 {
     uploadForm.addEventListener('submit', async (e) => 
     {
        /**
         * @see Cancela el evento si este es cancelable, sin detener el 
         * resto del funcionamiento del evento, es decir, puede ser llamado 
         * de nuevo. En este caso evita que se envíe el formulario al presionar
         * el botón de tipo "submit", para poder trabajar previamente con el contenido
         * del formulario representado por el objeto de tipo FormData()
         */ 
        e.preventDefault();
         
        /**
         * @note Objeto FormData: Esencial para enviar archivos binarios al backend.
         * Codifica automáticamente los campos en el formato 'multipart/form-data'.
         */
        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('author', document.getElementById('author').value);
        formData.append('category_id', document.getElementById('category').value);
        formData.append('pages', document.getElementById('pages').value);
        
        // files[0] accede al binario crudo del archivo seleccionado en el input de tipo file
        formData.append('pdfFile', document.getElementById('pdfFile').files[0]);

        try 
        {
            // Pasamos true como cuarto parámetro para indicar que enviamos FormData
            await apiService.request('/books/upload', 'POST', formData, true);
            showModal('Éxito', 'Documento guardado e indexado correctamente.');
            uploadForm.reset();
            loadBooks();
        } 
        catch (error) 
        {
            showModal('Error al cargar', error.message);
        }
     });
 }