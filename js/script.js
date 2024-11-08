import { insertHtml } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
    insertHtml('sidebar');

    const dropdownButton = document.getElementById('dropdownButton');
    const sidebar = document.getElementById('sidebar');

    dropdownButton.addEventListener('click', function (event) {
        event.stopPropagation();
        sidebar.classList.toggle('hidden');
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', function (event) {
        if (!dropdownButton.contains(event.target) && !sidebar.contains(event.target) && !sidebar.classList.contains('hidden')) {
            sidebar.classList.add('hidden');
            sidebar.classList.remove('active');
        }
    });
});
