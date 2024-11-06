import Service from './generic_server.js'; 
import BaseApp from './BaseApp.js';

class RolApp extends BaseApp {
    constructor() {
        const rolService = new Service('server_rol.php');
        super(rolService, "dataForm", "dataList");
    }

    getItemHtml(rol) {
        return `
            <h3 class="text-lg font-semibold">${rol.nombre}</h3>
            <p>Descripcion: ${rol.descripcion}</p>
            <div class="mt-4 flex justify-between">
                <button onclick="rolApp.editData(${rol.id})" class="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
                <button onclick="rolApp.confirmDelete(${rol.id})" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar</button>
            </div>
        `;
    }

    getFormData(formData) {
        return {
            nombre: formData.get("nombre"),
            descripcion: formData.get("descripcion")
        };
    }

    populateForm(rol) {
        document.getElementById('id').value = rol.id; 
        document.getElementById('nombre').value = rol.nombre;
        document.getElementById('descripcion').value = rol.descripcion;
    }
}

// Inicializar la aplicación
const rolApp = new RolApp();
window.rolApp = rolApp;
