class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.openButton = document.getElementById('openModal');
        this.closeButton = document.getElementById('closeModal');
        this.dataForm = document.getElementById("dataForm"); 
        this.init();
    }

    init() {
        this.openButton.addEventListener('click', () => this.open());
        this.closeButton.addEventListener('click', () => this.close());

        // Cerrar el modal al hacer clic fuera de él
        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });
    }

    open() {
        this.modal.classList.remove('hidden');
    }

    close() {
        this.modal.classList.add('hidden');
        this.clear(); 
    }

    clear() {
        if (this.dataForm) {
            this.dataForm.reset();
        }
    }
}

export default Modal;
