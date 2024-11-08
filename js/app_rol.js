import Service from './generic_server.js';
import BaseApp from './BaseApp.js';

class RolApp extends BaseApp {
    constructor() {
        const rolService = new Service('server_rol.php');
        super(rolService, "dataForm", "dataList");
    }

    // Método para cargar los permisos disponibles
    async loadPermissions() {
        try {
            const response = await fetch('server_permiso.php', {
                method: 'POST',
                body: new URLSearchParams({ action: 'fetch' }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (!response.ok) throw new Error('Error al cargar los permisos');

            const permisos = await response.json();

            const permisosContainer = document.getElementById('permisos');
            permisosContainer.innerHTML = '';

            if (Array.isArray(permisos) && permisos.length) {
                permisos.forEach(permiso => {
                    const checkboxWrapper = document.createElement('div');
                    checkboxWrapper.classList.add('flex', 'items-center', 'mb-3');

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `permiso_${permiso.id}`;
                    checkbox.value = permiso.id;
                    checkbox.name = 'rolxpermiso[]';

                    const label = document.createElement('label');
                    label.setAttribute('for', checkbox.id);
                    label.classList.add('ml-2');
                    label.textContent = permiso.nombre;

                    checkboxWrapper.appendChild(checkbox);
                    checkboxWrapper.appendChild(label);

                    permisosContainer.appendChild(checkboxWrapper);
                });
            } else {
                const noPermisosMessage = document.createElement('p');
                noPermisosMessage.textContent = 'No se encontraron permisos disponibles.';
                permisosContainer.appendChild(noPermisosMessage);
            }
        } catch (error) {
            console.error('Error al cargar los permisos:', error);
            const permisosContainer = document.getElementById('permisos');
            permisosContainer.innerHTML = '';
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Error al cargar los permisos.';
            permisosContainer.appendChild(errorMessage);
        }
    }

    // Método para obtener los datos del formulario
    getFormData(formData) {
        return {
            id: formData.get("id"),
            nombre: formData.get("nombre"),
            descripcion: formData.get("descripcion"),
            rolxpermiso: formData.getAll("rolxpermiso[]")
        };
    }

    async saveRolData() {
        const formData = new FormData(document.getElementById('dataForm'));
    
        const rolxpermiso = [];
        const checkboxes = document.querySelectorAll('input[name="rolxpermiso[]"]:checked');
        console.log(checkboxes);
        checkboxes.forEach(checkbox => {
            rolxpermiso.push(checkbox.value); 
        });
    
        const action = document.getElementById('id').value ? 'update' : 'add'; 
    
        const data = {
            id: formData.get("id"),
            nombre: formData.get("nombre"),
            descripcion: formData.get("descripcion"),
            permisos: rolxpermiso 
        };
    
        try {
            let response;
    
            if (action === 'add') {
                // Enviar los datos para agregar un nuevo rol
                response = await fetch('server_global.php', {
                    method: 'POST',
                    body: new URLSearchParams({
                        action: 'add',
                        table: 'rol',
                        data: JSON.stringify(data) // Convertimos los datos a formato JSON
                    })
                });
            } else if (action === 'update') {
                // Enviar los datos para actualizar el rol
                response = await fetch('server_global.php', {
                    method: 'POST',
                    body: new URLSearchParams({
                        action: 'update',
                        table: 'rol',
                        data: JSON.stringify(data) // Convertimos los datos a formato JSON
                    })
                });
            }
    
            const result = await response.json();
        } catch (error) {
            console.error("Error al guardar el rol:", error);
        }
    }
    
    populateForm(rol) {
        document.getElementById('id').value = rol.id;
        document.getElementById('nombre').value = rol.nombre;
        document.getElementById('descripcion').value = rol.descripcion;
        const permisosSeleccionados = rol.permisos_ids ? rol.permisos_ids.split(',') : [];

        permisosSeleccionados.forEach(id => {
            const checkbox = document.getElementById(`permiso_${id}`);
            if (checkbox) checkbox.checked = true;
        });
    }

    // Método para renderizar cada rol
    getItemHtml(rol) {
        const permisosIconos = {
            1: {
                nombre: 'Lee',
                icono: 'fas fa-eye'    
            },
            2: {
                nombre: 'Escribe',
                icono: 'fas fa-pencil-alt'
            },
            3: {
                nombre: 'Elimina',
                icono: 'fas fa-trash' 
            },
            4: {
                nombre: 'Actualiza',
                icono: 'fas fa-sync-alt'
            },
            0: {
                nombre: 'Sin asignar',
                icono: 'fas fa-ban'
            }
        };
        
        const permisosSeleccionados = rol.permisos_ids ? rol.permisos_ids.split(',').map(Number) : [];
        let iconosHtml = [];
        if (permisosSeleccionados.length > 0) {
            iconosHtml = permisosSeleccionados.map(permiso => {
                const iconoClase = permisosIconos[permiso];
                return `<span title="${iconoClase.nombre}" class="text-gray-500"><i class="${iconoClase.icono}"></i></span>`;
            }).join('');
        } else {
            iconosHtml = `<span title="${permisosIconos[0].nombre}" class="text-gray-500"><i class="${permisosIconos[0].icono}"></i></span>`;
        }
        return `
            <div class="relative">
                <div class="absolute top-0 right-0 flex space-x-2 p-2">
                    ${iconosHtml}
                </div>

                <h3 class="text-lg font-semibold">${rol.nombre}</h3>
                <p>Descripción: ${rol.descripcion}</p>
                <div class="mt-4 flex justify-between">
                    <button onclick="rolApp.editData(${rol.id})" class="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
                    <button onclick="rolApp.confirmDelete(${rol.id})" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar</button>
                </div>
            </div>
        `;
    }
}

// Inicializar la aplicación
const rolApp = new RolApp();
window.rolApp = rolApp;

// Cargar permisos al inicio
rolApp.loadPermissions();
