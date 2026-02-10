const API_URL = "https://alquiler-facil-backendd.onrender.com";

/* ======================
   PUBLICAR ALQUILER
====================== */
const form = document.getElementById("form-publicar");

if (form) {
  form.addEventListener("submit", async (e) => {
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
      form.reset();

    } catch (err) {
      alert("❌ Error al publicar alquiler");
      console.error(err);
    }
  });
}

/* ======================
   LISTAR ALQUILERES
====================== */
const lista = document.getElementById("lista-alquileres");

if (lista) {
  cargarAlquileres();
}

async function cargarAlquileres() {
  try {
    const res = await fetch(`${API_URL}/alquileres`);
    const alquileres = await res.json();

    lista.innerHTML = "";

    if (alquileres.length === 0) {
      lista.innerHTML = "<p class='sin-resultados'>No hay alquileres publicados</p>";
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
