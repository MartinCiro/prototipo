
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


// FUNCIONES CRUD
document.addEventListener("DOMContentLoaded", function () {
    const dataForm = document.getElementById("dataForm");
    const dataList = document.getElementById("dataList");
    const modalExito = document.getElementById("modalExito");
    const mensajeExito = document.getElementById("mensajeExito");
    const modalEliminar = document.getElementById("modalEliminar");
    const btnEliminar = document.getElementById("btnEliminar");
    let currentId = null;

    // Cargar todos los usuarios al inicio
    fetchUsers();

    // Función para mostrar el modal de éxito (oculta el modal después de 3 segundos)
    function showModalExito(message) {
        mensajeExito.textContent = message;
        modalExito.classList.remove("hidden");
        setTimeout(() => modalExito.classList.add("hidden"), 3000);
    }

    // Función para cargar los usuarios
    function fetchUsers() {
        fetch("server_usuario.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "action=fetch",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta de la red");
                }
                return response.json();
            })
            .then(users => {
                dataList.innerHTML = "";
                if (users.length === 0) {
                    dataList.innerHTML = "<p>No hay usuarios disponibles.</p>";
                }
                users.forEach(user => {
                    const userCard = document.createElement("div");
                    userCard.className = "p-4 border rounded-lg shadow-md bg-white";
                    userCard.innerHTML = `
                        <h3 class="text-lg font-semibold">${user.nombre}</h3>
                        <p>Email: ${user.email}</p>
                        <p>Teléfono: ${user.telefono}</p>
                        <div class="mt-4 flex justify-between">
                            <button onclick="editUser(${user.id})" class="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
                            <button onclick="confirmDelete(${user.id})" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar</button>
                        </div>
                    `;
                    dataList.appendChild(userCard);
                });
            })
            .catch(error => {
                console.error("Error al cargar usuarios:", error);
                dataList.innerHTML = "<p>Ocurrió un error al cargar los usuarios.</p>";
            });
    }

    // Función para agregar o actualizar usuario
    dataForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(dataForm);
        const action = currentId ? "update" : "add";
        formData.append("action", action);
        if (currentId) formData.append("id", currentId);

        fetch("server_usuario.php", {
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showModalExito(data.message);
                    dataForm.reset();
                    currentId = null;
                    fetchUsers();

                    // Ocultar el sidebar tras guardar exitosamente
                    barraLateral.classList.remove("active");
                } else {
                    console.log("Error: " + data.message);
                }
            })
            .catch(error => console.error("Error en el guardado:", error));
    });

    // Función para editar usuario
    window.editUser = function (id) {
        fetch("server_usuario.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `action=fetch&id=${id}`,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta de la red");
                }
                return response.json();
            })
            .then(user => {
                if (user && user.nombre && user.email && user.telefono && user.password) {
                    document.getElementById("nombre").value = user.nombre;
                    document.getElementById("email").value = user.email;
                    document.getElementById("telefono").value = user.telefono;
                    document.getElementById("contrasenia").value = user.password;
                    currentId = id;

                    // Mostrar el sidebar para editar
                    barraLateral.classList.add("active");
                } else {
                    showModalExito("Error al cargar los datos del usuario. Intenta nuevamente.");
                }
            })
            .catch(error => {
                console.error("Error al cargar usuario:", error);
                showModalExito("Ocurrió un error al intentar cargar los datos del usuario.");
            });
    };

    // Función para confirmar eliminación de usuario
    window.confirmDelete = function (id) {
        currentId = id;
        modalEliminar.classList.remove("hidden");
    };

    // Eliminar usuario
    btnEliminar.addEventListener("click", function () {
        fetch("server_usuario.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `action=delete&id=${currentId}`,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showModalExito(data.message);
                    fetchUsers();
                    currentId = null;
                }
                modalEliminar.classList.add("hidden");
            })
            .catch(error => console.error("Error al eliminar usuario:", error));
    });

    // Cerrar modal de eliminación
    document.getElementById("btnCancelar").addEventListener("click", function () {
        modalEliminar.classList.add("hidden");
    });
});
