// ============================
// UTILIDADES
// ============================
function mostrarMensaje(texto, tipo = "success") {
    const msg = document.createElement("div");
    msg.className = `mensaje ${tipo}`;
    msg.textContent = texto;

    document.body.appendChild(msg);

    setTimeout(() => msg.classList.add("mostrar"), 100);

    setTimeout(() => {
        msg.classList.remove("mostrar");
        setTimeout(() => msg.remove(), 300);
    }, 3000);
}

// ============================
// PUBLICAR ALQUILER (POST)
// ============================
const formPublicar = document.querySelector("#form-publicar");

if (formPublicar) {
    formPublicar.addEventListener("submit", async (e) => {
        e.preventDefault();

        const datos = {
            tipo: formPublicar.tipo.value,
            distrito: formPublicar.distrito.value.trim(),
            direccion: formPublicar.direccion.value.trim(),
            piso: formPublicar.piso.value,
            precio: Number(formPublicar.precio.value),
            condiciones: formPublicar.condiciones.value.trim(),
            telefono: formPublicar.telefono.value.trim()
        };

        try {
            const res = await fetch("http://localhost:3000/alquileres", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            if (!res.ok) throw new Error("Error al guardar");

            await res.json();
            mostrarMensaje("✅ Alquiler publicado correctamente");
            formPublicar.reset();

        } catch (error) {
            console.error(error);
            mostrarMensaje("❌ Error al publicar alquiler", "error");
        }
    });
}

// ============================
// BUSCAR ALQUILERES (GET + FILTRO)
// ============================
const formBuscar = document.querySelector("#form-buscar");
const contenedorResultados = document.querySelector("#resultados");

async function obtenerAlquileres() {
    try {
        const res = await fetch("http://localhost:3000/alquileres");
        return await res.json();
    } catch (error) {
        console.error("Error cargando alquileres", error);
        return [];
    }
}

function mostrarResultados(lista) {
    contenedorResultados.innerHTML = "";

    if (lista.length === 0) {
        contenedorResultados.innerHTML = `
            <p class="sin-resultados">❌ No se encontraron resultados</p>
        `;
        return;
    }

    mostrarMensaje(`🔍 ${lista.length} alquiler(es) encontrado(s)`, "info");

    lista.forEach((alquiler) => {
        const card = document.createElement("div");
        card.className = "card fade-in";

        card.innerHTML = `
            <h3>${alquiler.tipo}</h3>
            <p><strong>Distrito:</strong> ${alquiler.distrito}</p>
            <p><strong>Precio:</strong> S/${alquiler.precio}</p>
            <a href="detalle.html?id=${alquiler.id}" class="btn">Ver detalles</a>
        `;

        contenedorResultados.appendChild(card);
    });
}

// Cargar todos al entrar a buscar.html
if (contenedorResultados) {
    obtenerAlquileres().then(mostrarResultados);
}

// Filtro
if (formBuscar) {
    formBuscar.addEventListener("submit", async (e) => {
        e.preventDefault();

        const distrito = formBuscar.distrito.value.toLowerCase();
        const tipo = formBuscar.tipo.value;
        const precioMax = Number(formBuscar.precio.value);

        const alquileres = await obtenerAlquileres();

        const filtrados = alquileres.filter(a => {
            return (
                (!distrito || a.distrito.toLowerCase().includes(distrito)) &&
                (!tipo || a.tipo === tipo) &&
                (!precioMax || a.precio <= precioMax)
            );
        });

        mostrarResultados(filtrados);
    });
}

// ============================
// DETALLE DEL ALQUILER (GET POR ID)
// ============================
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id) {
    fetch(`http://localhost:3000/alquileres`)
        .then(res => res.json())
        .then(alquileres => {
            const alquiler = alquileres.find(a => a.id == id);

            if (!alquiler) {
                mostrarMensaje("❌ Alquiler no encontrado", "error");
                return;
            }

            document.querySelector("#detalle-tipo").textContent = alquiler.tipo;
            document.querySelector("#detalle-precio").textContent = `S/${alquiler.precio}`;
            document.querySelector("#detalle-distrito").textContent = alquiler.distrito;
            document.querySelector("#detalle-direccion").textContent = alquiler.direccion;
            document.querySelector("#detalle-piso").textContent = alquiler.piso;
            document.querySelector("#detalle-condiciones").textContent =
                alquiler.condiciones || "No especificadas";
            document.querySelector("#detalle-telefono").textContent = alquiler.telefono;

            document.querySelector("#detalle-maps").href =
                `https://www.google.com/maps?q=${encodeURIComponent(alquiler.direccion)}`;

            document.querySelector("#detalle-llamar").href =
                `tel:${alquiler.telefono}`;
        })
        .catch(err => {
            console.error(err);
            mostrarMensaje("❌ Error cargando detalle", "error");
        });
}
// ============================
// PWA - SERVICE WORKER
// ============================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("✅ Service Worker registrado"))
    .catch((err) => console.error("❌ Error SW:", err));
}
