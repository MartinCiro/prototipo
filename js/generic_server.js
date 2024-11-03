import ApiService from './service/Api_service.js';

class Service extends ApiService {
    constructor(endpoint) {
        super(endpoint); 
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

// Exportar la clase
export default Service;
