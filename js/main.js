const API_URL = "https://alquiler-facil-backendd.onrender.com";

/* =========================
   PUBLICAR ALQUILER
========================= */
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Error al publicar");
      }

      alert("✅ Alquiler publicado correctamente");
      form.reset();
    } catch (error) {
      console.error(error);
      alert("❌ Error al publicar el alquiler");
    }
  });
}

/* =========================
   MOSTRAR ALQUILERES
========================= */
async function cargarAlquileres() {
  const contenedor = document.getElementById("lista-alquileres");
  if (!contenedor) return;

  try {
    const res = await fetch(`${API_URL}/alquileres`);
    const alquileres = await res.json();

    contenedor.innerHTML = "";

    alquileres.forEach((a) => {
      contenedor.innerHTML += `
        <article class="card">
          <h3>${a.tipo}</h3>
          <p><strong>Distrito:</strong> ${a.distrito}</p>
          <p><strong>Dirección:</strong> ${a.direccion}</p>
          <p><strong>Piso:</strong> ${a.piso}</p>
          <p><strong>Precio:</strong> S/ ${a.precio}</p>
          <p><strong>Condiciones:</strong> ${a.condiciones || "-"}</p>
          <a href="https://wa.me/51${a.telefono}" target="_blank" class="btn">
            Contactar 📲
          </a>
        </article>
      `;
    });
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = "<p>Error cargando alquileres</p>";
  }
}

document.addEventListener("DOMContentLoaded", cargarAlquileres);
