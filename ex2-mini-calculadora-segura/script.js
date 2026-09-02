const STORAGE_KEY = "calculadora_historial";
let historial = [];

const cargarHistorial = () => {
  const guardado = localStorage.getItem(STORAGE_KEY);
  historial = guardado ? JSON.parse(guardado) : [];
};

const guardarHistorial = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
};

const renderHistorial = () => {
  const $historial = $("#historial");
  $historial.empty();

  historial.forEach(({ num1, num2, operacion, resultado, fecha }) => {
    const item = `
      <li>
        ${num1} ${operacion} ${num2} = <strong>${resultado}</strong>
        <span class="fecha">${fecha}</span>
      </li>
    `;
    $historial.append(item);
  });
};

const mostrarMensaje = (mensaje, tipo) => {
  $("#resultado").text(mensaje).removeClass("ok error").addClass(tipo);
};

const calcular = ({ num1, num2, operacion }) => {
  console.log(
    "Entrada -> operación solicitada:",
    operacion,
    "| datos recibidos:",
    { num1, num2 },
  );

  if (num1 === "" || num2 === "") {
    const msg = "Error: ambos campos deben tener un valor.";
    console.error("Salida -> Error:", msg);
    return { ok: false, mensaje: msg };
  }

  const n1 = Number(num1);
  const n2 = Number(num2);

  if (Number.isNaN(n1) || Number.isNaN(n2)) {
    const msg = "Error: ambos valores deben ser números válidos.";
    console.error("Salida -> Error:", msg);
    return { ok: false, mensaje: msg };
  }

  if (operacion === "/" && n2 === 0) {
    const msg = "Error: no se puede dividir entre cero.";
    console.error("Salida -> Error:", msg);
    return { ok: false, mensaje: msg };
  }

  let resultado;
  switch (operacion) {
    case "+":
      resultado = n1 + n2;
      break;
    case "-":
      resultado = n1 - n2;
      break;
    case "*":
      resultado = n1 * n2;
      break;
    case "/":
      resultado = n1 / n2;
      break;
    default: {
      const msg = "Error: operación no reconocida.";
      console.error("Salida -> Error:", msg);
      return { ok: false, mensaje: msg };
    }
  }

  console.log("Salida -> Resultado numérico:", resultado);

  return { ok: true, resultado, n1, n2 };
};

$(document).ready(() => {
  cargarHistorial();
  renderHistorial();

  $("#btnCalcular").on("click", () => {
    const datos = {
      num1: $("#num1").val().trim(),
      num2: $("#num2").val().trim(),
      operacion: $("#operacion").val(),
    };

    const resultadoCalculo = calcular(datos);

    if (!resultadoCalculo.ok) {
      mostrarMensaje(resultadoCalculo.mensaje, "error");
      return;
    }

    const { resultado, n1, n2 } = resultadoCalculo;

    mostrarMensaje(`Resultado: ${resultado}`, "ok");

    const registro = {
      num1: n1,
      num2: n2,
      operacion: datos.operacion,
      resultado,
      fecha: new Date().toLocaleString(),
    };

    historial.unshift(registro);
    guardarHistorial();
    renderHistorial();

    console.log("Estado del historial actualizado:", historial);
  });

  $("#btnLimpiar").on("click", () => {
    historial = [];
    guardarHistorial();
    renderHistorial();
    console.log("Historial limpiado. Estado actual:", historial);
  });
});
