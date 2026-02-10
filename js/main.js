const API_URL = "https://alquiler-facil-backendd.onrender.com";

/* ======================
   PUBLICAR ALQUILER
====================== */
const formPublicar = document.getElementById("form-publicar");

if (formPublicar) {
  formPublicar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      tipo: tipo.value,
      distrito: distrito.value,
      direccion: direccion.value,
      piso: piso.value,
      precio: precio.value,
      condiciones: condiciones.value,
      telefono: telefono.value
    };

    try {
      const res = await fetch(`${API_URL}/alquileres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error();

      alert("✅ Alquiler publicado correctamente");
      formPublicar.reset();

    } catch (err) {
      alert("❌ Error al publicar alquiler");
      console.error(err);
    }
  });
}

/* ======================
   LISTAR ALQUILERES (INDEX)
====================== */
const lista = document.getElementById("lista-alquileres");

if (lista) {
  cargarAlquileres();
}

async function cargarAlquileres(query = "") {
  try {
    const res = await fetch(`${API_URL}/alquileres${query}`);
    const data = await res.json();

    lista.innerHTML = "";

    if (data.length === 0) {
      lista.innerHTML = "<p class='sin-resultados'>No hay alquileres</p>";
      return;
    }

    data.forEach(a => {
      lista.innerHTML += `
        <div class="card fade-in">
          <h3>${a.tipo}</h3>
          <p><strong>Distrito:</strong> ${a.distrito}</p>
          <p><strong>Dirección:</strong> ${a.direccion}</p>
          <p><strong>Piso:</strong> ${a.piso}</p>
          <p><strong>Precio:</strong> S/ ${a.precio}</p>
          <p><strong>Condiciones:</strong> ${a.condiciones || "-"}</p>
          <a class="btn" href="tel:${a.telefono}">Contactar 📞</a>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    lista.innerHTML = "<p>Error al cargar alquileres</p>";
  }
}

/* ======================
   BUSCAR ALQUILERES (BUSCAR.HTML)
====================== */
const formBuscar = document.getElementById("form-buscar");
const resultados = document.getElementById("resultados");

if (formBuscar) {
  formBuscar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const distrito = document.getElementById("buscar-distrito").value;
    const tipo = document.getElementById("buscar-tipo").value;
    const min = document.getElementById("precio-min").value;
    const max = document.getElementById("precio-max").value;

    const params = new URLSearchParams();

    if (distrito) params.append("distrito", distrito);
    if (tipo) params.append("tipo", tipo);
    if (min) params.append("minPrecio", min);
    if (max) params.append("maxPrecio", max);

    try {
      const res = await fetch(`${API_URL}/alquileres?${params.toString()}`);
      const data = await res.json();

      resultados.innerHTML = "";

      if (data.length === 0) {
        resultados.innerHTML = "<p class='sin-resultados'>No se encontraron resultados</p>";
        return;
      }

      data.forEach(a => {
        resultados.innerHTML += `
          <div class="card fade-in">
            <h3>${a.tipo}</h3>
            <p><strong>Distrito:</strong> ${a.distrito}</p>
            <p><strong>Dirección:</strong> ${a.direccion}</p>
            <p><strong>Piso:</strong> ${a.piso}</p>
            <p><strong>Precio:</strong> S/ ${a.precio}</p>
            <p><strong>Condiciones:</strong> ${a.condiciones || "-"}</p>
            <a class="btn" href="tel:${a.telefono}">Contactar 📞</a>
          </div>
        `;
      });

    } catch (err) {
      console.error(err);
      resultados.innerHTML = "<p>Error al buscar alquileres</p>";
    }
  });
}
