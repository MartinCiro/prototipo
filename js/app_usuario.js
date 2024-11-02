
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

class ApiService {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(method, endpoint, data = null) {
        const options = {
            method: method,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        if (data) options.body = data;

        try {
            const response = await fetch(`${this.baseURL}/${endpoint}`, options);
            if (!response.ok) throw new Error("Error en la respuesta de la red");
            return await response.json();
        } catch (error) {
            console.error("Error en la solicitud:", error);
            throw error;
        }
    }
}

class UserService extends ApiService {
    constructor() {
        super('server_usuario.php');
    }

    async fetchAll() {
        return await this.request("POST", "", "action=fetch");
    }

    async add(data) {
        const formData = new URLSearchParams({ ...data, action: "add" });
        return await this.request("POST", "", formData);
    }

    async update(data) {
        const formData = new URLSearchParams({ ...data, action: "update" });
        return await this.request("POST", "", formData);
    }

    async delete(id) {
        return await this.request("POST", "", `action=delete&id=${id}`);
    }
}

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
            password: formData.get("contrasenia"),
        };

        try {
            if (this.currentId) {
                userData.id = this.currentId;
                await this.userService.update(userData);
                this.showMessage("Usuario actualizado con éxito.");
            } else {
                await this.userService.add(userData);
                this.showMessage("Usuario agregado con éxito.");
            }
            this.dataForm.reset();
            this.currentId = null;
            this.fetchUsers();
        } catch (error) {
            this.showMessage("Error al guardar el usuario.");
        }
    }

    async editUser(id) {
        try {
            const users = await this.userService.fetchAll();
            const user = users.find(u => u.id === id);
            if (user) {
                this.populateForm(user);
                this.currentId = id;
            }
        } catch (error) {
            this.showMessage("Error al cargar los datos del usuario.");
        }
    }

    populateForm(user) {
        document.getElementById("nombre").value = user.nombre;
        document.getElementById("email").value = user.email;
        document.getElementById("telefono").value = user.telefono;
        document.getElementById("contrasenia").value = user.password;
    }

    confirmDelete(id) {
        this.currentId = id;
        this.modalEliminar.classList.remove("hidden");
    }

    async deleteUser() {
        try {
            await this.userService.delete(this.currentId);
            this.showMessage("Usuario eliminado con éxito.");
            this.fetchUsers();
        } catch (error) {
            this.showMessage("Error al eliminar el usuario.");
        } finally {
            this.closeDeleteModal();
        }
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
const userService = new UserService();
const userApp = new UserApp(userService);
