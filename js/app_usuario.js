import Service from './generic_server.js'; 
import BaseApp from './BaseApp.js';

class UserApp extends BaseApp {
    constructor() {
        const userService = new Service('server_usuario.php');
        super(userService, "dataForm", "dataList");
    }

    async loadRoles() {
        try {
            const response = await fetch('server_rol.php', {
                method: 'POST',
                body: new URLSearchParams({ action: 'fetch' }),  
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' 
                }
            });
    
            const roles = await response.json();
    
            const roleSelect = document.getElementById('id_rol');
            roleSelect.innerHTML = ''; 
            
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.classList.add('w-full', 'p-2', 'border', 'rounded-lg', 'focus:ring-2', 'focus:ring-indigo-500');
            defaultOption.textContent = 'Seleccione un rol';
            roleSelect.appendChild(defaultOption);
    
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.nombre;
                roleSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error cargando los roles:', error);
        }
    }
    

    getItemHtml(user) {
        const { id, nombre, email, telefono, rol_nombre } = user;
        console.log(user.permiso_nombre);
        return `
            <h3 class="text-lg font-semibold">${nombre}</h3>
            <p>Email: ${email}</p>
            <p>Teléfono: ${telefono}</p>
            ${rol_nombre ? `<p>Rol: ${rol_nombre}</p>` : 'Sin rol asignado'}
            <div class="mt-4 flex justify-between">
                <button onclick="userApp.editData(${id})" class="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
                <button onclick="userApp.confirmDelete(${id})" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar</button>
            </div>
        `;
    }

    getFormData(formData) {
        return {
            nombre: formData.get("nombre"),
            email: formData.get("email"),
            telefono: formData.get("telefono"),
            contrasenia: formData.get("contrasenia"),
            id_rol: formData.get("id_rol") 
        };
    }

    populateForm(user) {
        document.getElementById('id').value = user.id;
        document.getElementById('nombre').value = user.nombre;
        document.getElementById('email').value = user.email;
        document.getElementById('telefono').value = user.telefono;
        document.getElementById('contrasenia').value = '';
        document.getElementById('id_rol').value = user.id_rol; 
    }
}

// Inicializar la aplicación
const userApp = new UserApp();
window.userApp = userApp;

userApp.loadRoles();

