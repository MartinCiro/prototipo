import Service from './generic_server.js'; 
import BaseApp from './BaseApp.js';

class PermisoApp extends BaseApp {
    constructor() {
        const permisoService = new Service('server_permiso.php');
        super(permisoService, "dataForm", "dataList");
    }

    getItemHtml(permiso) {
        return `
            <h3 class="text-lg font-semibold">${permiso.nombre}</h3>
            <p>Descripcion: ${permiso.descripcion}</p>
            <div class="mt-4 flex justify-between">
                <button onclick="permisoApp.editData(${permiso.id})" class="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
                <button onclick="permisoApp.confirmDelete(${permiso.id})" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar</button>
            </div>
        `;
    }

    getFormData(formData) {
        return {
            nombre: formData.get("nombre"),
            descripcion: formData.get("descripcion")
        };
    }

    populateForm(permiso) {
        document.getElementById('id').value = permiso.id; 
        document.getElementById('nombre').value = permiso.nombre;
        document.getElementById('descripcion').value = permiso.descripcion;
    }
}

// Inicializar la aplicación
const permisoApp = new PermisoApp();
window.permisoApp = permisoApp;
