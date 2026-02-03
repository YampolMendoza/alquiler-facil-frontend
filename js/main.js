const API_URL = "https://alquiler-facil-backendd.onrender.com";

// FORM PUBLICAR
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
