const API_URL = 'https://jsonplaceholder.typicode.com/users';

let usuarios = [];

const cargarUsuarios = async () => {
    try {
        const { data } = await axios.get(API_URL);

        usuarios = data;

        console.log('========== CARGA DE USUARIOS ==========');
        console.log(`Cantidad de usuarios: ${usuarios.length}`);

        renderizarUsuarios(usuarios);
    } catch (error) {
        console.error('Error al cargar los usuarios:', error);

        $('#tablaUsuarios').html(`
            <tr>
                <td colspan="3">
                    No se pudieron cargar los usuarios.
                </td>
            </tr>
        `);
    }
};

const renderizarUsuarios = (listaUsuarios) => {
    const filas = listaUsuarios
        .map(({ id, name, email, company }) => `
            <tr class="usuario-row" data-id="${id}">
                <td>${name}</td>
                <td>${email}</td>
                <td>${company.name}</td>
            </tr>
        `)
        .join('');

    $('#tablaUsuarios').html(filas);
};

const mostrarSoloNombres = (listaUsuarios) => {
    const filas = listaUsuarios
        .map(({ id, name }) => `
            <tr class="usuario-row" data-id="${id}">
                <td colspan="3">${name}</td>
            </tr>
        `)
        .join('');

    $('#tablaUsuarios').html(filas);
};

$('#filtro').on('input', (event) => {
    const termino = $(event.currentTarget)
        .val()
        .trim()
        .toLowerCase();

    if (termino === '') {
        renderizarUsuarios(usuarios);

        $('#resultadoFiltro').text(
            `Usuarios encontrados: ${usuarios.length}`
        );

        console.log('========== FILTRO ==========');
        console.log('Término usado: ""');
        console.log(`Cantidad de coincidencias: ${usuarios.length}`);

        return;
    }

    // Buscar por nombre
    const usuariosFiltrados = usuarios.filter(({ name }) =>
        name.toLowerCase().includes(termino)
    );

    mostrarSoloNombres(usuariosFiltrados);

    console.log('========== FILTRO ==========');
    console.log(`Término usado: "${termino}"`);
    console.log(`Cantidad de coincidencias: ${usuariosFiltrados.length}`);

    // Mostrar mensaje si no encuentra personas
    if (usuariosFiltrados.length === 0) {
        $('#resultadoFiltro').text(
            'No se encontraron usuarios.'
        );

        $('#tablaUsuarios').html(`
            <tr>
                <td colspan="3">
                    No se encontraron usuarios.
                </td>
            </tr>
        `);
    } else {
        $('#resultadoFiltro').text(
            `Personas encontradas: ${usuariosFiltrados.length}`
        );
    }
});

$(document).on('click', '.usuario-row', (event) => {
    const idUsuario = Number(
        $(event.currentTarget).data('id')
    );

    const usuario = usuarios.find(
        ({ id }) => id === idUsuario
    );

    if (!usuario) {
        return;
    }

    const {
        name,
        phone,
        address
    } = usuario;

    const {
        street,
        suite,
        city,
        zipcode
    } = address;

    const direccion =
        `${street}, ${suite}, ${city}, ${zipcode}`;

    $('#detalleNombre').text(name);
    $('#detalleTelefono').text(phone);
    $('#detalleDireccion').text(direccion);

    $('#detalleUsuario').removeClass('oculto');

    console.log('========== USUARIO SELECCIONADO ==========');
    console.log('Detalle del usuario:', usuario);
});



$('#cerrarDetalle').on('click', () => {
    $('#detalleUsuario').addClass('oculto');
    console.log('Detalle del usuario cerrado');
});

cargarUsuarios();