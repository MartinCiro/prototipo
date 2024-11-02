<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyecto factura</title>
    <link href="css/tailwind.min.css" rel="stylesheet">
</head>

<body class="flex flex-col min-h-screen bg-gray-100 text-gray-800">

    <!-- Encabezado Principal -->
    <header class="bg-indigo-600 p-4 shadow-md flex items-center justify-between relative">
        <h1 class="text-white text-3xl font-bold">Inicio</h1>
    </header>

    <!-- Contenido Principal -->
    <main id="mainContent" class="flex-grow container mx-auto my-10 px-4">
        <section class="bg-white shadow-md rounded-lg p-6">
            <h2 class="text-2xl font-semibold text-gray-700 mb-4">Bienvenido</h2>
            <p class="text-gray-600">Esta es la página de inicio de la aplicación de gestión.</p>

            <h3 class="text-xl font-semibold mt-4">Carpetas disponibles:</h3>
            <ul class="mt-2">
                <?php
                // Leer carpetas desde la raíz
                $directories = glob('*', GLOB_ONLYDIR); // Buscar directorios en la raíz

                if (!empty($directories)) {
                    foreach ($directories as $dir) {
                        echo "<li class='mt-2'><a href='$dir' class='text-blue-600 hover:underline' target='_blank'>$dir</a></li>";
                    }
                } else {
                    echo "<li>No hay carpetas disponibles.</li>";
                }
                ?>
            </ul>

            <h3 class="text-xl font-semibold mt-4">Archivos APK disponibles:</h3>
            <ul class="mt-2">
                <?php
                // Leer archivos .apk desde la raíz
                $apkFiles = glob('*.apk'); // Buscar archivos .apk en la raíz

                if (!empty($apkFiles)) {
                    foreach ($apkFiles as $file) {
                        echo "<li class='mt-2'><a href='$file' class='text-blue-600 hover:underline' target='_blank'>$file</a></li>";
                    }
                } else {
                    echo "<li>No hay archivos APK disponibles.</li>";
                }
                ?>
            </ul>

            <h3 class="text-xl font-semibold mt-4">Proyecto de Aula (Archivos ZIP o RAR):</h3>
            <ul class="mt-2">
                <?php
                // Leer archivos .zip y .rar desde la raíz
                $projectFiles = array_merge(glob('*.zip'), glob('*.rar')); // Buscar archivos .zip y .rar en la raíz

                if (!empty($projectFiles)) {
                    foreach ($projectFiles as $file) {
                        echo "<li class='mt-2'><a href='$file' class='text-blue-600 hover:underline' target='_blank'>$file</a></li>";
                    }
                } else {
                    echo "<li>No hay archivos ZIP o RAR disponibles.</li>";
                }
                ?>
            </ul>

            <h3 class="text-xl font-semibold mt-4">Bases de Datos (Archivos SQL):</h3>
            <ul class="mt-2">
                <?php
                // Leer archivos .sql desde la raíz
                $sqlFiles = glob('*.sql'); // Buscar archivos .sql en la raíz

                if (!empty($sqlFiles)) {
                    foreach ($sqlFiles as $file) {
                        echo "<li class='mt-2'><a href='$file' class='text-blue-600 hover:underline' target='_blank'>$file</a></li>";
                    }
                } else {
                    echo "<li>No hay archivos SQL disponibles.</li>";
                }
                ?>
            </ul>

            <h3 class="text-xl font-semibold mt-4">Backend (Archivos php):</h3>
            <ul class="mt-2">
                <?php
                // Leer archivos .php desde la raíz
                $phpFiles = glob('*.php'); // Buscar archivos .php en la raíz

                if (!empty($phpFiles)) {
                    foreach ($phpFiles as $file) {
                        echo "<li class='mt-2'><a href='$file' class='text-blue-600 hover:underline' target='_blank'>$file</a></li>";
                    }
                } else {
                    echo "<li>No hay archivos php disponibles.</li>";
                }
                ?>
            </ul>

            <h3 class="text-xl font-semibold mt-4">Frontend (Archivos html):</h3>
            <ul class="mt-2">
                <?php
                // Leer archivos .html desde la raíz
                $htmlFiles = glob('*.html'); // Buscar archivos .html en la raíz

                if (!empty($htmlFiles)) {
                    foreach ($htmlFiles as $file) {
                        echo "<li class='mt-2'><a href='$file' class='text-blue-600 hover:underline' target='_blank'>$file</a></li>";
                    }
                } else {
                    echo "<li>No hay archivos html disponibles.</li>";
                }
                ?>
            </ul>
        </section>
    </main>

    <!-- Pie de Página Fijo -->
    <footer class="bg-indigo-600 text-white text-left p-4 fixed bottom-0 w-full">
        <p>&copy; 2024 Sistema de Gestión. Jose Germán Estrada Clavijo.</p>
    </footer>

</body>

</html>
