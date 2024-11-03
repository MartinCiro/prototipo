export function insertHtml(html, nomId = null) {
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
