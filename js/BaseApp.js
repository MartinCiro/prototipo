import Modal from './modal.js';
import { insertHtml } from './utils.js';

class BaseApp {
    constructor(service, formId, listId) {
        this.service = service;
        this.dataForm = document.getElementById(formId);
        this.dataList = document.getElementById(listId);
        this.modalExito = document.getElementById("modalExito");
        this.mensajeExito = document.getElementById("mensajeExito");
        this.modalEliminar = document.getElementById("modalEliminar");
        this.btnEliminar = document.getElementById("btnEliminar");
        this.currentId = null;
        this.modal = new Modal('modal');
        this.init();
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => {
            insertHtml('sidebar');
            this.fetchData();
            this.dataForm.addEventListener("submit", (event) => this.handleFormSubmit(event));
            this.btnEliminar.addEventListener("click", () => this.deleteData());
            document.getElementById("btnCancelar").addEventListener("click", () => this.closeDeleteModal());
        });
    }

    async fetchData() {
        try {
            const data = await this.service.fetchAll();
            this.renderList(data);
        } catch (error) {
            this.showMessage("Ocurrió un error al cargar los datos.");
        }
    }

    renderList(data) {
        this.dataList.innerHTML = "";
        if (data.length === 0) {
            this.dataList.innerHTML = "<p>No hay datos disponibles.</p>";
            return;
        }

        data.forEach(item => {
            const itemCard = this.createItemCard(item);
            this.dataList.appendChild(itemCard);
        });
    }

    createItemCard(item) {
        const card = document.createElement("div");
        card.className = "p-4 border rounded-lg shadow-md bg-white";
        card.innerHTML = this.getItemHtml(item);
        return card;
    }

    getItemHtml(item) {
        // Debe ser implementado en las clases derivadas
        throw new Error("getItemHtml() debe ser implementado.");
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(this.dataForm);
        const itemData = this.getFormData(formData);
    
        try {
            let response;
            if (!this.currentId) {
                response = await this.service.add(itemData);
            } else {
                itemData.id = this.currentId;
                response = await this.service.update(itemData);
            }
    
            this.showMessage(response.message);
            if (response.success) {
                this.dataForm.reset(); 
                this.currentId = null; 
                this.modal.close(); 
                this.fetchData(); 
            }
        } catch (error) {
            this.showMessage("Error al guardar los datos.");
        }
    }

    getFormData(formData) {
        // Debe ser implementado en las clases derivadas
        throw new Error("getFormData() debe ser implementado.");
    }

    async editData(id) {
        try {
            const item = await this.service.fetchAll()
            .then(data => data.find(u => u.id == id));    
            if (item) {
                this.populateForm(item);
                this.currentId = id;
                document.getElementById('modal').classList.remove('hidden');
            } else {
                this.showMessage("No se ha encontrado el item solicitado.");
            }
        } catch (error) {
            this.showMessage("Error al cargar los datos.");
        }
    }
    
    populateForm(item) {
        throw new Error("populateForm() debe ser implementado.");
    }    
    
    async deleteData() {
        try {
            const response = await this.service.delete(this.currentId);
            this.showMessage(response.message);
            this.fetchData();
        } catch (error) {
            this.showMessage("Error al eliminar el dato.");
        } finally {
            this.closeDeleteModal();
        }
    }

    confirmDelete(id) {
        this.currentId = id;
        this.modalEliminar.classList.remove("hidden");
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

export default BaseApp;
