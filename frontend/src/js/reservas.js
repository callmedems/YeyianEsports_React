// Inicialización de Flatpickr para la fecha
flatpickr("#fecha", {
  minDate: "today", // Esta línea es para no permitir fechas pasadas
  disable: [
    function (date) {
      const fechasOcupadas = ["2025-05-01", "2025-05-05"]; // Fechas ocupadas simuladas
      return fechasOcupadas.includes(date.toISOString().split("T")[0]);
    },
  ],
  onChange: function (selectedDates) {
    const fechaSeleccionada = selectedDates[0];
    if (fechaSeleccionada) {
      document.getElementById("mensaje").innerText = "¡Fecha disponible!";
      document.getElementById("mensaje").style.color = "green";
    } else {
      document.getElementById("mensaje").innerText =
        "Selecciona una fecha válida.";
      document.getElementById("mensaje").style.color = "red";
    }
  },
});


let iti;

document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.querySelector("#whatsapp-number");
  iti = window.intlTelInput(phoneInput, {
    preferredCountries: ["mx", "us"],
    separateDialCode: true,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.9/js/utils.js",
  });
});

// Progresión entre pasos, inicializamos la variable en uno para que así se muestre la primera parte del forms
let currentStep = 1;

// Esta función permite avanzar entre los pasos del forms
function nextStep(step) {
  if (!validateStep(currentStep)) return;

  // Animación
  document.getElementById(`step-${currentStep}`).style.position = "absolute";
  document.getElementById(`step-${currentStep}`).classList.remove("active");

  document.getElementById(`step-${step}`).classList.add("active");
  currentStep = step;
}
// Regresar al paso anterior del forms
function prevStep(step) {
  document.getElementById(`step-${currentStep}`).style.position = "absolute";
  document.getElementById(`step-${currentStep}`).classList.remove("active");

  document.getElementById(`step-${step}`).classList.add("active");
  currentStep = step;
}

function validarFormatoCorreo(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

// Función de validación para los campos en cada paso
function validateStep(step) {
  let isValid = true;

  if (step === 1) {
    // Validación Paso 1: Datos personales
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");

    if (!nombre.value.trim()) {
      isValid = false;
      showErrorTooltip(nombre, "Por favor ingresa tu nombre");
    } else {
      clearErrorTooltip(nombre);
    }

    if (!correo.value.trim()) {
      isValid = false;
      showErrorTooltip(correo, "Por favor ingresa tu correo");
    } else if (!validarFormatoCorreo(correo.value)) {
      // Nueva validación
      isValid = false;
      showErrorTooltip(correo, "Formato de correo inválido");
    } else {
      clearErrorTooltip(correo);
    }
  } else if (step === 2) {
    // Validación tipoReserva
    const tipoReserva = document.getElementById("tipoReserva");
    if (!tipoReserva.value) {
      isValid = false;
      showErrorTooltip(tipoReserva, "Por favor selecciona un tipo de reserva");
    } else {
      clearErrorTooltip(tipoReserva);
    }

    // Validación de contacto si el banner está visible
    if (document.getElementById("special-banner").style.display === "block") {
      const contactMethod = document.querySelector(
        'input[name="contact-method"]:checked'
      );
      const phoneInput = document.getElementById("whatsapp-number");
      const emailInput = document.getElementById("email-input");

      if (!contactMethod) {
        isValid = false;
        document.getElementById("mensaje").innerText =
          "Selecciona un método de contacto";
        document.getElementById("mensaje").style.color = "red";
      } else if (contactMethod.value === "whatsapp" && !iti.isValidNumber()) {
        isValid = false;
        showErrorTooltip(phoneInput, "Número telefónico inválido");
      } else if (contactMethod.value === "email") {
        if (!emailInput.value.trim()) {
          isValid = false;
          showErrorTooltip(emailInput, "Por favor ingresa tu correo");
        } else if (!validarFormatoCorreo(emailInput.value)) {
          // Nueva validación
          isValid = false;
          showErrorTooltip(emailInput, "Formato de correo inválido");
        } else {
          clearErrorTooltip(emailInput);
        }
      }
    }
  } else if (step === 3) {
    // Validación Paso 3: Fecha y hora
    const fecha = document.getElementById("fecha");
    const hora = document.getElementById("hora");
    if (!fecha.value) {
      isValid = false;
      showErrorTooltip(fecha, "Por favor selecciona una fecha");
    } else {
      clearErrorTooltip(fecha);
    }
    if (!hora.value) {
      isValid = false;
      showErrorTooltip(hora, "Por favor selecciona una hora");
    } else {
      clearErrorTooltip(hora);
    }
  }

  return isValid;
}

function showErrorTooltip(field, message) {
  const container = field.parentNode;
  container.style.position = "relative";

  let tooltip = container.querySelector(".error-tooltip");

  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.classList.add("error-tooltip");
    tooltip.innerHTML = `<span class="error-tooltip-icon">⚠️</span>${message}`;
    container.appendChild(tooltip);
  }

  tooltip.style.display = "block";

  setTimeout(() => {
    tooltip.style.display = "block";
  }, 10);
}

function clearErrorTooltip(field) {
  const container = field.parentNode;
  const tooltip = container.querySelector(".error-tooltip");
  if (tooltip) {
    tooltip.style.display = "none";
  }
}

function highlightEmptyField(field) {
  field.classList.add("error");
  const message = document.createElement("div");
  message.classList.add("mensaje-error");
  message.innerText = "Este campo es obligatorio.";
  field.parentNode.appendChild(message);
}

function clearHighlight(field) {
  field.classList.remove("error");
  const errorMessage = field.parentNode.querySelector(".mensaje-error");
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Validación y envío del formulario
document
  .getElementById("reservation-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    if (
      document.querySelector('input[name="contact-method"]:checked')?.value ===
        "whatsapp" &&
      !iti.isValidNumber()
    ) {
      alert("Por favor ingresa un número válido");
      return;
    }

    const nombre = event.target.nombre.value.trim();
    const correo = event.target.correo.value.trim();
    const tipoReserva = event.target.tipoReserva.value;
    const fecha = event.target.fecha.value;
    const hora = event.target.hora.value;

    if (!nombre || !correo || !tipoReserva || !fecha || !hora) {
      document.getElementById("mensaje").innerText =
        "Por favor completa todos los campos.";
      document.getElementById("mensaje").style.color = "red";
      return;
    }

    localStorage.setItem(
      "reserva",
      JSON.stringify({
        nombre,
        correo,
        tipoReserva,
        fecha,
        hora,
      })
    );
    window.location.href = "cotizacion.html";
  });

function checkSpecialReservation() {
  const tipoReserva = document.getElementById("tipoReserva").value;
  const specialBanner = document.getElementById("special-banner");
  const nextButton = document.getElementById("next-step-2");

  if (["Corporativo", "Streamer"].includes(tipoReserva)) {
    const nombre = document.getElementById("nombre").value || "visitante";
    document.getElementById("banner-nombre").textContent = nombre;
    document.getElementById("banner-tipo").textContent = tipoReserva;
    specialBanner.style.display = "block";
    nextButton.style.display = "none";
  } else {
    specialBanner.style.display = "none";
    nextButton.style.display = "inline-block";
  }
}

function showContactInput(type) {
  document.getElementById("whatsapp-container").style.display = "none";
  document.getElementById("email-input").style.display = "none";

  if (type === "whatsapp") {
    document.getElementById("whatsapp-container").style.display = "flex";
  } else if (type === "email") {
    document.getElementById("email-input").style.display = "block";
  }
}

function continueWithSpecialReservation() {
  const contactMethod = document.querySelector(
    'input[name="contact-method"]:checked'
  );
  const emailInput = document.getElementById("email-input");

  if (!contactMethod) {
    alert("Por favor selecciona un método de contacto");
    return;
  }

  let contactValue;
  if (contactMethod.value === "whatsapp") {
    if (!iti.isValidNumber()) {
      alert("Número telefónico inválido");
      return;
    }
    contactValue = iti.getNumber();
  } else {
    contactValue = emailInput.value;

    if (!contactValue) {
      showErrorTooltip(emailInput, "Por favor ingresa tu correo");
      return;
    } else if (!validarFormatoCorreo(contactValue)) {
      showErrorTooltip(emailInput, "Formato de correo inválido");
      return;
    }
  }

  const reserva = JSON.parse(localStorage.getItem("reserva") || "{}");
  reserva.contactMethod = contactMethod.value;
  reserva.contactValue = contactValue;
  localStorage.setItem("reserva", JSON.stringify(reserva));

  document.getElementById("special-banner").style.display = "none";
  nextStep(3);
}

function showContactInput(type) {
  document
    .querySelectorAll(".contact-input-container, .contact-input")
    .forEach((el) => {
      el.style.display = "none";
    });

  if (type === "whatsapp") {
    document.getElementById("whatsapp-container").style.display = "flex";
  } else if (type === "email") {
    document.getElementById("email-input").style.display = "block";
  }
}

// frontend/src/js/reservas.js

document.getElementById('formReserva').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Supongamos que obtienes el clientId del localStorage tras login:
  const clientId = localStorage.getItem('clientId'); // ajusta según tu flujo
  // O si usas JWT, envíalo en la cabecera Authorization

  const reservationDate = document.getElementById('fecha').value;
  const reservationTime = document.getElementById('hora').value;
  const reservationTypeId = document.getElementById('tipoReserva').value;
  // Otros campos del formulario…

  // Montar el body
  const bodyData = {
    clientId: clientId,
    reservationDate,
    reservationTime,
    reservationTypeId: parseInt(reservationTypeId),
    // …otros campos si existieran
  };

  try {
    const response = await fetch('http://localhost:3000/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Si usas JWT:
        // 'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(bodyData)
    });
    const data = await response.json();
    if (data.error) {
      alert('Error al crear reserva: ' + data.error);
    } else if (data.warning) {
      alert('Reserva creada, pero no se pudo enviar el correo de confirmación.');
    } else {
      alert('Reserva creada y correo de confirmación enviado. ¡Revisa tu correo!');
      // Limpiar formulario o redirigir, según tu flujo.
    }
  } catch (err) {
    console.error('Error en la petición:', err);
    alert('Ocurrió un problema de red al intentar reservar.');
  }
});
