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

// Exportar la clase
export default ApiService;