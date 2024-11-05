import Service from './generic_server.js'; 
import BaseApp from './BaseApp.js';

class ProductApp extends BaseApp {
    constructor() {
        const productService = new Service('server_producto.php');
        super(productService, "dataForm", "dataList");
    }

    getItemHtml(product) {
        return `
            <h3 class="text-lg font-semibold">${product.nombre}</h3>
            <p>Descripcion: ${product.descripcion}</p>
            <p>Precio: ${product.precio}</p>
            <p>Stock: ${product.stock}</p>
            <div class="mt-4 flex justify-between">
                <button onclick="productApp.editData(${product.id})" class="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
                <button onclick="productApp.confirmDelete(${product.id})" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar</button>
            </div>
        `;
    }

    getFormData(formData) {
        return {
            nombre: formData.get("nombre"),
            descripcion: formData.get("descripcion"),
            precio: formData.get("precio"),
            stock: formData.get("stock"),
        };
    }

    populateForm(product) {
        document.getElementById('id').value = product.id; 
        document.getElementById('nombre').value = product.nombre;
        document.getElementById('descripcion').value = product.descripcion;
        document.getElementById('precio').value = product.precio;
        document.getElementById('stock').value = product.stock;
    }
}

// Inicializar la aplicación
const productApp = new ProductApp();
window.productApp = productApp;
