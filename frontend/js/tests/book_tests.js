/**
 * @file book_tests.js
 * @brief Suite de pruebas unitarias simuladas para los endpoints de carga documental.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @brief Helper de pre-condición (Setup).
 * @details Inicia sesión silenciosamente para obtener el JWT antes de ejecutar pruebas 
 * sobre rutas protegidas.
 */
 async function okLogin() 
 {
     const response = await fetch('/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ username: 'pepe', password: '12345' })
     });
     const data = await response.json();
     localStorage.setItem('test_token', data.token);
 }
 
 // 1. Listar Libros (GET protegido)
 testUtils.createTestButton("Test Listar Mis Libros", async (btn) => 
 {
     await okLogin();
     const token = localStorage.getItem('test_token');
     
     const response = await fetch('/api/books/my-books', {
         headers: { 'Authorization': `Bearer ${token}` }
     });
     
     const data = await response.json();
     testUtils.log(data);
     
     if (response.ok) 
     {
         testUtils.setSuccess(btn);
     }
 });
 
 // 2. Subir Libro Simulado (POST Multipart)
 testUtils.createTestButton("Test Subir Libro PDF (Simulado)", async (btn) => 
 {
     await okLogin();
     const token = localStorage.getItem('test_token');
     
     const formData = new FormData();
     formData.append('title', 'Don Quijote de la Mancha');
     formData.append('author', 'Miguel de Cervantes');

     //agregado
     const catResponse = await fetch('/api/categories', {
         headers: { 'Authorization': `Bearer ${token}` }
     });
     const categories = await catResponse.json();
     formData.append('category_id', categories[0].id);
     
     
     formData.append('pages', '862');
 
     /**
      * @note Técnica de Testing Avanzada: Simulación de archivos en memoria.
      * En lugar de obligar al tester a seleccionar un archivo físico cada vez,
      * instanciamos un objeto 'Blob' (Binary Large Object) con una cabecera PDF falsa.
      * Esto engaña a Multer exitosamente permitiendo automatizar la prueba del endpoint.
      */
     const blob = new Blob(["%PDF-1.4 Simulated PDF Document Content"], { type: 'application/pdf' });
     formData.append('pdfFile', blob, 'don_quijote.pdf');
 
     const response = await fetch('/api/books/upload', {
         method: 'POST',
         headers: { 'Authorization': `Bearer ${token}` },
         body: formData
     });
 
     const data = await response.json();
     testUtils.log(data);
     
     if (response.ok) 
     {
         testUtils.setSuccess(btn);
     }
 });


  // 3. Listar Categorías (GET protegido)
 testUtils.createTestButton("Test Listar Categorías", async (btn) => 
 {
     await okLogin();
     const token = localStorage.getItem('test_token');
     
     const response = await fetch('/api/categories', {
         headers: { 'Authorization': `Bearer ${token}` }
     });
     
     const data = await response.json();
     testUtils.log(data);
     
     if (response.ok && data.length >= 5) 
     {
         testUtils.setSuccess(btn);
     }
 });
 
 // 4. Subir Libro con categoría inexistente (debe fallar con 400)
 testUtils.createTestButton("Test Categoría Inexistente (espera 400)", async (btn) => 
 {
     await okLogin();
     const token = localStorage.getItem('test_token');
     
     const formData = new FormData();
     formData.append('title', 'Libro de prueba');
     formData.append('author', 'Autor de prueba');
     formData.append('category_id', '9999');
     formData.append('pages', '10');
 
     const blob = new Blob(["%PDF-1.4 Simulated PDF Document Content"], { type: 'application/pdf' });
     formData.append('pdfFile', blob, 'prueba.pdf');
 
     const response = await fetch('/api/books/upload', {
         method: 'POST',
         headers: { 'Authorization': `Bearer ${token}` },
         body: formData
     });
 
     const data = await response.json();
     testUtils.log(data);
     
     // Aquí el éxito es que el sistema RECHACE la petición con un 400 controlado
     if (response.status === 400) 
     {
         testUtils.setSuccess(btn);
     }
 });