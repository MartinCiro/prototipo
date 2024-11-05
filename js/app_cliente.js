import Service from './generic_server.js'; 
import BaseApp from './BaseApp.js';

class ClienteApp extends BaseApp {
    constructor() {
        const clienteService = new Service('server_cliente.php');
        super(clienteService, "dataForm", "dataList");
    }

    getItemHtml(cliente) {
        return `
            <h3 class="text-lg font-semibold">${cliente.nombre}</h3>
            <p>Email: ${cliente.email}</p>
            <p>Telefono: ${cliente.telefono}</p>
            <p>Dirección: ${cliente.direccion}</p>
            <div class="mt-4 flex justify-between">
                <button onclick="clienteApp.editData(${cliente.id})" class="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
                <button onclick="clienteApp.confirmDelete(${cliente.id})" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar</button>
            </div>
        `;
    }

    getFormData(formData) {
        return {
            nombre: formData.get("nombre"),
            email: formData.get("email"),
            telefono: formData.get("telefono"),
            direccion: formData.get("direccion"),
        };
    }

    populateForm(cliente) {
        document.getElementById('id').value = cliente.id; 
        document.getElementById('nombre').value = cliente.nombre;
        document.getElementById('email').value = cliente.email;
        document.getElementById('telefono').value = cliente.telefono;
        document.getElementById('direccion').value = cliente.direccion;
    }
}

// Inicializar la aplicación
const clienteApp = new ClienteApp();
window.clienteApp = clienteApp;
