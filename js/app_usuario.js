//importar apiService
import Service from './generic_server.js'; 

const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('modal');

openModal.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// Cerrar el modal al hacer clic fuera de él
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
});

class UserApp {
    constructor(userService) {
        this.userService = userService;
        this.dataForm = document.getElementById("dataForm");
        this.dataList = document.getElementById("dataList");
        this.modalExito = document.getElementById("modalExito");
        this.mensajeExito = document.getElementById("mensajeExito");
        this.modalEliminar = document.getElementById("modalEliminar");
        this.btnEliminar = document.getElementById("btnEliminar");
        this.currentId = null;

        this.init();
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.fetchUsers();
            this.insertHtml('sidebar');
            this.dataForm.addEventListener("submit", (event) => this.handleFormSubmit(event));
            this.btnEliminar.addEventListener("click", () => this.deleteUser());
            document.getElementById("btnCancelar").addEventListener("click", () => this.closeDeleteModal());
        });
    }

    async fetchUsers() {
        try {
            const users = await this.userService.fetchAll();
            this.renderUserList(users);
        } catch (error) {
            this.showMessage("Ocurrió un error al cargar los usuarios.");
        }
    }

    renderUserList(users) {
        this.dataList.innerHTML = "";
        if (users.length === 0) {
            this.dataList.innerHTML = "<p>No hay usuarios disponibles.</p>";
            return;
        }

        users.forEach(user => {
            const userCard = document.createElement("div");
            userCard.className = "p-4 border rounded-lg shadow-md bg-white";
            userCard.innerHTML = `
                <h3 class="text-lg font-semibold">${user.nombre}</h3>
                <p>Email: ${user.email}</p>
                <p>Teléfono: ${user.telefono}</p>
                <div class="mt-4 flex justify-between">
                    <button onclick="userApp.editUser(${user.id})" class="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
                    <button onclick="userApp.confirmDelete(${user.id})" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar</button>
                </div>
            `;
            this.dataList.appendChild(userCard);
        });
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(this.dataForm);
        const userData = {
            nombre: formData.get("nombre"),
            email: formData.get("email"),
            telefono: formData.get("telefono"),
            contrasenia: formData.get("contrasenia"),
        };
    
        try {
            let response;
            if (!this.currentId) {
                // Crear nuevo usuario
                response = await this.userService.add(userData);
            } else {
                // Editar usuario existente
                userData.id = this.currentId;
                response = await this.userService.update(userData);
            }
    
            // Manejar la respuesta
            this.showMessage(response.message);
            if (response.success) {
                this.dataForm.reset(); // Reiniciar los campos
                this.currentId = null; // Resetear el ID
                this.closeModal(); // Cerrar el modal
                this.fetchUsers(); // Actualizar la lista de usuarios
            }
        } catch (error) {
            this.showMessage("Error al guardar el usuario."); // Mensaje genérico
        }
    }
    

    async editUser(id) {
        try {
            // Intentar obtener el usuario directamente sin llamar a fetchAll nuevamente
            const user = await this.userService.fetchAll().then(users => users.find(u => u.id === id));
    
            if (user) {
                this.populateForm(user);
                this.currentId = id;
                // Abrir el modal para editar
                document.getElementById('modal').classList.remove('hidden');
            } else {
                this.showMessage("Usuario no encontrado.");
            }
        } catch (error) {
            this.showMessage("Error al cargar los datos del usuario.");
        }
    }
    

    populateForm(user) {
        document.getElementById('id').value = user.id; 
        document.getElementById('nombre').value = user.nombre;
        document.getElementById('email').value = user.email;
        document.getElementById('telefono').value = user.telefono;
        document.getElementById('contrasenia').value = '';
        
    }

    confirmDelete(id) {
        this.currentId = id;
        this.modalEliminar.classList.remove("hidden");
    }

    insertHtml(html, nomId = null) {
        // Si nomId es nulo, asignar el valor de html
        if (nomId === null) {
            nomId = html;
        }
        
        fetch(`../components/${html}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(nomId);
                if (element) {
                    element.innerHTML = data;
                } else {
                    console.error(`Element with ID ${nomId} not found.`);
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
    

    async deleteUser() {
        try {
            const response = await this.userService.delete(this.currentId);
            this.showMessage(response.message);
            this.fetchUsers();
        } catch (error) {
            this.showMessage("Error al eliminar el usuario.");
        } finally {
            this.closeDeleteModal();
        }
    }

    closeModal() {
        document.getElementById('modal').classList.add('hidden'); // Cerrar el modal
    }

    closeDeleteModal() {
        this.modalEliminar.classList.add("hidden");
    }

    showMessage(message) {
        this.mensajeExito.textContent = message;
        this.modalExito.classList.remove("hidden");
        setTimeout(() => this.modalExito.classList.add("hidden"), 3000);
    }
}

// Inicializar la aplicación
const userService = new Service('server_usuario.php');
const userApp = new UserApp(userService);
window.userApp = userApp;
