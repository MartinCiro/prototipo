export function createUserForm(onSubmit, onClose, fields) {
    // Crear los campos del formulario
    const fields = [
        { id: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Nombre', required: true },
        { id: 'email', label: 'E-mail', type: 'email', placeholder: 'E-mail', required: true },
        { id: 'telefono', label: 'Teléfono', type: 'tel', placeholder: 'Teléfono', required: true },
        { id: 'contrasenia', label: 'Contraseña', type: 'password', placeholder: 'Contraseña', required: true },
    ];

    // Crear el contenedor del formulario
    const formContainer = document.createElement('div');
    formContainer.className = 'bg-white rounded-lg shadow-lg p-6 w-96 relative';

    // Crear el título
    const title = document.createElement('h2');
    title.className = 'text-2xl font-semibold mb-6 text-gray-700';
    title.textContent = 'Crear o Editar';
    formContainer.appendChild(title);

    // Crear el formulario
    const form = document.createElement('form');
    form.id = 'dataForm';
    form.className = 'space-y-6';
    form.onsubmit = (e) => {
        e.preventDefault();
        onSubmit(new FormData(form));
    };

    fields.forEach(field => {
        const fieldDiv = document.createElement('div');

        const label = document.createElement('label');
        label.htmlFor = field.id;
        label.className = 'block text-lg font-medium';
        label.textContent = field.label;
        fieldDiv.appendChild(label);

        const input = document.createElement('input');
        input.type = field.type;
        input.id = field.id;
        input.name = field.id;
        input.placeholder = field.placeholder;
        input.required = field.required;
        input.className = 'w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500';
        fieldDiv.appendChild(input);

        form.appendChild(fieldDiv);
    });

    // Crear botón de guardar
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'block w-full py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex items-center justify-center';
    submitButton.ariaLabel = 'Guardar usuario';

    const svgSave = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgSave.setAttribute('class', 'w-5 h-5 mr-2');
    svgSave.setAttribute('viewBox', '0 0 24 24');
    svgSave.setAttribute('fill', 'none');
    svgSave.setAttribute('stroke', 'currentColor');
    svgSave.setAttribute('stroke-width', '2');
    svgSave.setAttribute('stroke-linecap', 'round');
    svgSave.setAttribute('stroke-linejoin', 'round');
    
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z');
    svgSave.appendChild(path1);

    const polyline1 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline1.setAttribute('points', '17 21 17 13 7 13 7 21');
    svgSave.appendChild(polyline1);

    const polyline2 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline2.setAttribute('points', '7 3 7 8 15 8');
    svgSave.appendChild(polyline2);

    submitButton.appendChild(svgSave);
    submitButton.appendChild(document.createTextNode('Guardar Usuario'));
    form.appendChild(submitButton);

    // Crear botón de cerrar
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'mt-6 block w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center';
    closeButton.ariaLabel = 'Cerrar formulario';
    closeButton.onclick = onClose;

    const svgClose = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgClose.setAttribute('class', 'w-5 h-5 mr-2');
    svgClose.setAttribute('fill', 'currentColor');
    svgClose.setAttribute('viewBox', '0 0 24 24');

    const pathClose = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathClose.setAttribute('d', 'M18.36 6.64a9 9 0 1 0 0 10.72 9 9 0 0 0 0-10.72zm-1.42 9.42l-1.41 1.41L12 12.41l-4.93 4.93-1.41-1.41L10.59 12 5.66 7.07l1.41-1.41L13.41 12l4.93 4.93 1.41-1.41L14.41 12l4.93-4.93z');
    svgClose.appendChild(pathClose);

    closeButton.appendChild(svgClose);
    closeButton.appendChild(document.createTextNode('Cerrar'));
    
    // Añadir el formulario y el botón de cerrar al contenedor
    formContainer.appendChild(form);
    formContainer.appendChild(closeButton);

    // Devolver el contenedor del formulario
    return formContainer;
}

// Ejemplo de uso
document.body.appendChild(createUserForm((formData) => {
    console.log('Datos del formulario:', Object.fromEntries(formData));
}, () => {
    console.log('Formulario cerrado');
}));
