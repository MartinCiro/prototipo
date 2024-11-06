import { insertHtml } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
    // Insertar el HTML del sidebar (asegurándote de que insertas el contenido correctamente)
    insertHtml('sidebar');

    // Obtener los elementos del DOM
    const dropdownButton = document.getElementById('dropdownButton');
    const sidebar = document.getElementById('sidebar');

    // Alternar la visibilidad del sidebar cuando se haga clic en el botón
    dropdownButton.addEventListener('click', function (event) {
        // Evitar que el evento se propague al window
        event.stopPropagation();
        sidebar.classList.toggle('hidden');
        sidebar.classList.toggle('active');
    });

    // Cierra el sidebar si se hace clic fuera de él
    document.addEventListener('click', function (event) {
        // Verificar si el clic fue fuera del dropdownButton o del sidebar
        if (!dropdownButton.contains(event.target) && !sidebar.contains(event.target) && !sidebar.classList.contains('hidden')) {
            sidebar.classList.add('hidden');
            sidebar.classList.remove('active');
        }
    });
});
