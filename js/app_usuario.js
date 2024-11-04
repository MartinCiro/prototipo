import Service from './generic_server.js'; 
import BaseApp from './BaseApp.js';

class UserApp extends BaseApp {
    constructor() {
        const userService = new Service('server_usuario.php');
        super(userService, "dataForm", "dataList");
    }

    getItemHtml(user) {
        return `
            <h3 class="text-lg font-semibold">${user.nombre}</h3>
            <p>Email: ${user.email}</p>
            <p>Teléfono: ${user.telefono}</p>
            <div class="mt-4 flex justify-between">
                <button onclick="userApp.editData(${user.id})" class="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
                <button onclick="userApp.confirmDelete(${user.id})" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar</button>
            </div>
        `;
    }

    getFormData(formData) {
        return {
            nombre: formData.get("nombre"),
            email: formData.get("email"),
            telefono: formData.get("telefono"),
            contrasenia: formData.get("contrasenia"),
        };
    }

    populateForm(user) {
        document.getElementById('id').value = user.id; 
        document.getElementById('nombre').value = user.nombre;
        document.getElementById('email').value = user.email;
        document.getElementById('telefono').value = user.telefono;
        document.getElementById('contrasenia').value = '';
    }
}

// Inicializar la aplicación
const userApp = new UserApp();
window.userApp = userApp;
