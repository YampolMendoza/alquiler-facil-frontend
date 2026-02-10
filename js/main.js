const API_URL = "https://alquiler-facil-backendd.onrender.com";

/* ======================
   PUBLICAR ALQUILER
====================== */
const formPublicar = document.getElementById("form-publicar");

if (formPublicar) {
  formPublicar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      tipo: document.getElementById("tipo").value,
      distrito: document.getElementById("distrito").value,
      direccion: document.getElementById("direccion").value,
      piso: document.getElementById("piso").value,
      precio: document.getElementById("precio").value,
      condiciones: document.getElementById("condiciones").value,
      telefono: document.getElementById("telefono").value
    };

    try {
      const res = await fetch(`${API_URL}/alquileres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Error al publicar");

      alert("✅ Alquiler publicado correctamente");
      formPublicar.reset();

    } catch (err) {
      alert("❌ Error al publicar alquiler");
      console.error(err);
    }
  });
}

/* ======================
   LISTAR / BUSCAR ALQUILERES
====================== */
const lista = document.getElementById("lista-alquileres");
const formBuscar = document.getElementById("form-buscar");

// FUNCIÓN PRINCIPAL
async function cargarAlquileres(params = "") {
  if (!lista) return;

  try {
    const res = await fetch(`${API_URL}/alquileres${params}`);
    const alquileres = await res.json();

    lista.innerHTML = "";

    if (alquileres.length === 0) {
      lista.innerHTML = "<p class='sin-resultados'>No se encontraron resultados</p>";
      return;
    }

    alquileres.forEach(a => {
      const card = document.createElement("div");
      card.className = "card fade-in";

      card.innerHTML = `
        <h3>${a.tipo}</h3>
        <p><strong>Distrito:</strong> ${a.distrito}</p>
        <p><strong>Dirección:</strong> ${a.direccion}</p>
        <p><strong>Piso:</strong> ${a.piso}</p>
        <p><strong>Precio:</strong> S/ ${a.precio}</p>
        <p><strong>Condiciones:</strong> ${a.condiciones || "-"}</p>
        <a class="btn" href="tel:${a.telefono}">Contactar 📞</a>
      `;

      lista.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    lista.innerHTML = "<p>Error al cargar alquileres</p>";
  }
}

// CARGAR TODOS AL ENTRAR (index.html y buscar.html)
if (lista) {
  cargarAlquileres();
}

/* ======================
   FILTROS DE BÚSQUEDA
====================== */
if (formBuscar) {
  formBuscar.addEventListener("submit", (e) => {
    e.preventDefault();

    const distrito = document.getElementById("filtro-distrito")?.value || "";
    const tipo = document.getElementById("filtro-tipo")?.value || "";
    const min = document.getElementById("precio-min")?.value || "";
    const max = document.getElementById("precio-max")?.value || "";

    let params = "?";

    if (distrito) params += `distrito=${encodeURIComponent(distrito)}&`;
    if (tipo) params += `tipo=${encodeURIComponent(tipo)}&`;
    if (min) params += `minPrecio=${min}&`;
    if (max) params += `maxPrecio=${max}&`;

    cargarAlquileres(params);
  });
}
/* ======================
   BUSCAR ALQUILERES
====================== */
const formBuscar = document.getElementById("form-buscar");
const resultados = document.getElementById("resultados");

if (formBuscar) {
  formBuscar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const distrito = document.getElementById("buscar-distrito").value;
    const tipo = document.getElementById("buscar-tipo").value;
    const minPrecio = document.getElementById("precio-min").value;
    const maxPrecio = document.getElementById("precio-max").value;

    const params = new URLSearchParams();

    if (distrito) params.append("distrito", distrito);
    if (tipo) params.append("tipo", tipo);
    if (minPrecio) params.append("minPrecio", minPrecio);
    if (maxPrecio) params.append("maxPrecio", maxPrecio);

    try {
      const res = await fetch(`${API_URL}/alquileres?${params.toString()}`);
      const data = await res.json();

      resultados.innerHTML = "";

      if (data.length === 0) {
        resultados.innerHTML = "<p class='sin-resultados'>No se encontraron resultados</p>";
        return;
      }

      data.forEach(a => {
        const card = document.createElement("div");
        card.className = "card fade-in";

        card.innerHTML = `
          <h3>${a.tipo}</h3>
          <p><strong>Distrito:</strong> ${a.distrito}</p>
          <p><strong>Dirección:</strong> ${a.direccion}</p>
          <p><strong>Piso:</strong> ${a.piso}</p>
          <p><strong>Precio:</strong> S/ ${a.precio}</p>
          <p><strong>Condiciones:</strong> ${a.condiciones || "-"}</p>
          <a class="btn" href="tel:${a.telefono}">Contactar 📞</a>
        `;

        resultados.appendChild(card);
      });

    } catch (err) {
      console.error(err);
      resultados.innerHTML = "<p>Error al buscar alquileres</p>";
    }
  });
}
