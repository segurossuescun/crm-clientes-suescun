//===================
// Variable Globales
//===================
let clientesData = [];
let clientesEliminados = [];
let clienteSeleccionado = null;
let buscarInput;
let coincidenciasDiv;
let infoClienteDiv;
let formActualizarDiv;

//===========================================================
// Funciones Globales (las que se llaman desde varias partes)
//===========================================================

//**************************************
// Mostrar Tabla con todos los clientes 
//************************************** 

function mostrarTabla(data) {
  console.log("🔍 Datos recibidos para mostrarTabla:", data);

  // Mostrar encabezado y botón
  mostrarVista("vista-ver-todos");

  // Mostrar tabla separada
  document.getElementById("tabla-independiente").style.display = "block";

  const encabezado = document.getElementById("encabezado-clientes");
  const cuerpo = document.getElementById("cuerpo-clientes");

  encabezado.innerHTML = '';
  cuerpo.innerHTML = '';

  if (data.length === 0) return;
    // 💥 ORDENAR POR NOMBRE
   data.sort((a, b) => {
    const nombreA = a["Nombre y Apellido"]?.toLowerCase() || "";
    const nombreB = b["Nombre y Apellido"]?.toLowerCase() || "";
    return nombreA.localeCompare(nombreB);
    });

  const campos = Object.keys(data[0]);

  // Crear encabezado
  campos.forEach(campo => {
    const th = document.createElement("th");
    th.textContent = campo;
    encabezado.appendChild(th);
  });

  // Crear filas
  data.forEach(cliente => {
  const fila = document.createElement("tr");
  campos.forEach(campo => {
    const td = document.createElement("td");
    if (campo === "Fecha de Nacimiento") {
      const fecha = new Date(cliente[campo]);
      td.textContent = isNaN(fecha) ? cliente[campo] : fecha.toLocaleDateString();
      } else if (campo === "Teléfono") {
      const tel = cliente[campo]?.toString().padStart(10, "0");
      td.textContent = tel.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    } else {
      td.textContent = cliente[campo] || "";
    }
    fila.appendChild(td);
  });
  cuerpo.appendChild(fila);
});
}

 //********************
 // Clientes Eliminados
 //*********************

 // Funcion Mostrar vista de Clientes Eliminados
   function mostrarVistaEliminados() {
    mostrarVista("vista-eliminados");
    mostrarTablaEliminados(clientesEliminados);
  }

  // Restaurar Cliente Eliminado
function restaurarCliente(index) {
  const clienteRestaurado = clientesEliminados.splice(index, 1)[0];
  clientesData.push(clienteRestaurado);

  mostrarTablaEliminados(clientesEliminados);
  mostrarTabla(clientesData);
  alert("¡Cliente restaurado con éxito! 🎉");
}

  // Funcion Mostrar Tabla de Clientes Eliminados
  function mostrarTablaEliminados(data) {
  const encabezadoEliminados = document.getElementById("encabezado-eliminados");
  const cuerpoEliminados = document.getElementById("cuerpo-eliminados");

  encabezadoEliminados.innerHTML = '';
  cuerpoEliminados.innerHTML = '';

  if (data.length === 0) return;
  // 💥 ORDENAR POR NOMBRE
  data.sort((a, b) => {
  const nombreA = a["Nombre y Apellido"]?.toLowerCase() || "";
  const nombreB = b["Nombre y Apellido"]?.toLowerCase() || "";
  return nombreA.localeCompare(nombreB);
});

  const encabezados = Object.keys(data[0]);
  encabezados.forEach(campo => {
    const th = document.createElement("th");
    th.textContent = campo;
    encabezadoEliminados.appendChild(th);
  });

  const thRestaurar = document.createElement("th");
  thRestaurar.textContent = "Acciones";
  encabezadoEliminados.appendChild(thRestaurar);

  data.forEach((cliente, index) => {
    const fila = document.createElement("tr");
    encabezados.forEach(campo => {
      const td = document.createElement("td");
      if (campo === "Fecha de Nacimiento") {
      const fecha = new Date(cliente[campo]);
      td.textContent = isNaN(fecha) ? cliente[campo] : fecha.toLocaleDateString();
    } else if (campo === "Teléfono") {
      const tel = cliente[campo]?.toString().padStart(10, "0");
      td.textContent = tel.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    } else {
      td.textContent = cliente[campo] || "";
    }
      fila.appendChild(td);
    });

    const tdAccion = document.createElement("td");
    const btnRestaurar = document.createElement("button");
    btnRestaurar.textContent = "↩️ Restaurar";
    btnRestaurar.onclick = () => restaurarCliente(index);
    tdAccion.appendChild(btnRestaurar);
    fila.appendChild(tdAccion);

    cuerpoEliminados.appendChild(fila);
  });
}

  // Funcion Eliminar Cliente
  function eliminarCliente() {
    if (!clienteSeleccionado) return;
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;

    clientesData = clientesData.filter(c => c["Nombre y Apellido"] !== clienteSeleccionado["Nombre y Apellido"]);
    clientesEliminados.push(clienteSeleccionado);

    clienteSeleccionado = null;
    document.getElementById("info-cliente").innerHTML = '';
    document.getElementById("formulario-actualizar").innerHTML = '';
    document.getElementById("coincidencias").innerHTML = '';
    document.getElementById("buscar-nombre").value = '';

    mostrarTabla(clientesData);
    mostrarVista("vista-eliminados");
    mostrarTablaEliminados(clientesEliminados);
  }

  //******************
  //  Mostrar Vistas
  // *****************

function mostrarVista(idVista) {
  const vistas = document.querySelectorAll('.vista');
  vistas.forEach(vista => vista.classList.remove('activa'));

  const vistaSeleccionada = document.getElementById(idVista);
  if (vistaSeleccionada) {
    vistaSeleccionada.classList.add('activa');
    console.log("👁️ Mostrando vista:", idVista);
  } else {
    console.warn("⚠️ No se encontró la vista con ID:", idVista);
  }

  // Mostrar u ocultar la tabla separada
  const tabla = document.getElementById("tabla-independiente");
  if (tabla) {
    tabla.style.display = idVista === "vista-ver-todos" ? "block" : "none";
  }
  const tablaEliminados = document.getElementById("tabla-eliminados-wrapper");
  if (tablaEliminados) {
    tablaEliminados.style.display = idVista === "vista-eliminados" ? "block" : "none";
}

  // Mostrar u ocultar la tabla de eliminados
const vistaEliminados = document.getElementById("vista-eliminados");
if (vistaEliminados) {
  vistaEliminados.style.display = idVista === "vista-eliminados" ? "block" : "none";
}
}

  //********************
  // Exportar a Excel
  // *******************
function exportarAExcel() {
  const tabla = document.getElementById("tabla-clientes");
  if (!tabla) {
    alert("No se encontró la tabla para exportar 😢");
    return;
  }

  let tablaHTML = tabla.outerHTML;
  let blob = new Blob(["\ufeff", tablaHTML], { type: "application/vnd.ms-excel" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "clientes.xls";
  a.click();
  URL.revokeObjectURL(url);

  alert("¡Exportación completada con éxito! 🎉");
}


  //============================
  // Carga Inicial Eventos DOM
  //============================


document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado ✅");

  document.getElementById("btn-agregar").addEventListener("click", () => {
    console.log("Clic en Agregar");
    mostrarVista("vista-agregar");
  });

  document.getElementById("btn-buscar").addEventListener("click", () => {
    console.log("Clic en Buscar");
    mostrarVista("vista-buscar");
  });

document.getElementById("btn-ver-todos").addEventListener("click", () => {
  console.log("Clic en Ver Todos");
  mostrarTabla(clientesData); // Esta función ya muestra la vista y la tabla correctamente
});

  document.getElementById("btn-ver-eliminados").addEventListener("click", () => {
    console.log("Clic en Ver Eliminados");
    mostrarVista("vista-eliminados");
    mostrarTablaEliminados(clientesEliminados);
  });
});

  // 1. Cargar datos
 fetch("static/clientes.json")
  .then(response => response.json())
  .then(data => {
    console.log("🧠 Datos cargados desde clientes.json:", data); // 👈 AÑADE ESTO
    clientesData = data;
    mostrarVista("vista-agregar");
  });
  
    //2. Configurar elementos DOM
  buscarInput = document.getElementById("buscar-nombre");
  coincidenciasDiv = document.getElementById("coincidencias");
  infoClienteDiv = document.getElementById("info-cliente");
  formActualizarDiv = document.getElementById("formulario-actualizar");

  //Logica para Embarazo 🫃 Habilitar o deshabilitar "¿Embarazada?" según el sexo
const sexoSelect = document.getElementById("nuevo-sexo");
const embarazadaSelect = document.getElementById("nuevo-embarazada");

sexoSelect.addEventListener("change", () => {
  if (sexoSelect.value === "F") {
    embarazadaSelect.disabled = false;
  } else {
    embarazadaSelect.value = "";
    embarazadaSelect.disabled = true;
  }
});

  // 3. Logica de busqueda
  buscarInput.addEventListener("input", () => {
    const texto = buscarInput.value.toLowerCase();
    coincidenciasDiv.innerHTML = "";
    infoClienteDiv.innerHTML = "";
    formActualizarDiv.innerHTML = "";

    if (texto === "") return;

    const coincidencias = clientesData.filter(cliente =>
      cliente["Nombre y Apellido"].toLowerCase().includes(texto)
    );

    coincidencias.forEach((cliente, index) => {
      const div = document.createElement("div");
      div.classList.add("coincidencia-item");
      div.textContent = cliente["Nombre y Apellido"];
      div.addEventListener("click", () => seleccionarCliente(cliente));
      coincidenciasDiv.appendChild(div);
    });
  });

function seleccionarCliente(cliente) {
  clienteSeleccionado = cliente;
  const fechaCruda = cliente["Fecha de Nacimiento"];
  let fechaFormateada = "";

  if (fechaCruda) {
    const fecha = new Date(fechaCruda);
    fechaFormateada = isNaN(fecha) ? fechaCruda : fecha.toLocaleDateString();
  }
  const telefonoCrudo = cliente["Teléfono"];
let telefonoFormateado = "";
if (telefonoCrudo) {
  const tel = telefonoCrudo.toString().padStart(10, "0");
  telefonoFormateado = tel.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}

  console.log(cliente);
 infoClienteDiv.innerHTML = `
  <h3>Información del Cliente</h3>
  <p><strong>Nombre y Apellido:</strong> ${cliente["Nombre y Apellido"] || ""}</p>
  <p><strong>Fecha de Nacimiento:</strong> ${fechaFormateada}</p>
  <p><strong>Teléfono:</strong> ${telefonoFormateado}</p>
  <p><strong>Correo:</strong> ${cliente["Correo"] || ""}</p>
  <p><strong>Dirección:</strong> ${cliente["Dirección"] || ""}</p>
  <p><strong>Sexo:</strong> ${cliente["Sexo"] || ""}</p>
  <p><strong>Embarazada:</strong> ${cliente["Embarazada"] || ""}</p>
  <p><strong>Dependes:</strong> ${cliente["Dependes"] || ""}</p>
  <p><strong>Fuma:</strong> ${cliente["Fuma"] || ""}</p>
  <p><strong>Salario Anual:</strong> ${cliente["Salario Anual"] || ""}</p>
  <p><strong>Status:</strong> ${cliente["Status"] || ""}</p>
  <p><strong>N° Status:</strong> ${cliente["N° Status"] || ""}</p> 
  <p><strong>SNS:</strong> ${cliente["SNS"] || ""}</p>
  <p><strong>Aseguranza:</strong> ${cliente["Aseguranza"] || ""}</p>
  <p><strong>ID del Seguro:</strong> ${cliente["ID del Seguro"] || ""}</p>
  <p><strong>Pago Mensual:</strong> ${cliente["Pago Mensual"] || ""}</p>

  <div style="margin-top: 10px;">
    <button onclick="eliminarCliente()">❌ Eliminar</button>
    <button onclick="mostrarFormularioActualizar()" style="margin-left: 10px;">🔄️ Actualizar</button>
  </div>
`;


  formActualizarDiv.innerHTML = "";
  formActualizarDiv.style.display = "none";
}

function mostrarFormularioActualizar() {
  if (!clienteSeleccionado) return;

  formActualizarDiv.style.display = "block";
  formActualizarDiv.innerHTML = `
  <h3>Actualizar Cliente</h3>
  <form id="form-actualizar-cliente">
    <input type="text" placeholder="Nombre y Apellido" value="${clienteSeleccionado["Nombre y Apellido"] || ""}" disabled>

    <div class="fila-corta">
      <div>
        <label for="actualizar-nacimiento">Fecha de Nacimiento:</label>
        <input type="date" id="actualizar-nacimiento" value="${clienteSeleccionado["Fecha de Nacimiento"] ? new Date(clienteSeleccionado["Fecha de Nacimiento"]).toISOString().split('T')[0] : ''}" class="form-control">
      </div>
      <div>
        <label for="actualizar-telefono">Teléfono:</label>
        <input type="text" id="actualizar-telefono" placeholder="Teléfono" value="${clienteSeleccionado["Teléfono"] || ""}" class="form-control">
      </div>
    </div>
    <div>
      <label for="actualizar-correo">Correo:</label>
      <input type="text" id="actualizar-correo" placeholder="Correo" value="${clienteSeleccionado["Correo"] || ""}" class="form-control">
    </div>
    <div>
      <label for="actualizar-direccion">Dirección:</label>
      <input type="text" id="actualizar-direccion" placeholder="Dirección" value="${clienteSeleccionado["Dirección"] || ""}" class="form-control">
    </div>
    <div class="fila-corta">
      <div>
        <label for="actualizar-sexo">Sexo:</label>
        <select id="actualizar-sexo" class="form-actualizar-select">
          <option value="">Sexo</option>
          <option value="M" ${clienteSeleccionado["Sexo"] === "M" ? "selected" : ""}>M</option>
          <option value="F" ${clienteSeleccionado["Sexo"] === "F" ? "selected" : ""}>F</option>
        </select>
      </div>
      <div>
        <label for="actualizar-embarazada">¿Embarazada?:</label>
        <select id="actualizar-embarazada" class="form-actualizar-select">
          <option value="">¿Embarazada?</option>
          <option value="Sí" ${clienteSeleccionado["Embarazada"] === "Sí" ? "selected" : ""}>Sí</option>
          <option value="No" ${clienteSeleccionado["Embarazada"] === "No" ? "selected" : ""}>No</option>
        </select>
      </div>
    </div>

    <div class="fila-corta">
      <div>
        <label for="actualizar-dependes">Dependes:</label>
        <input type="number" id="actualizar-dependes" placeholder="Dependes" value="${clienteSeleccionado["Dependes"] || ""}" class="form-control">
      </div>
      <div>
        <label for="actualizar-fuma">¿Fuma?:</label>
        <select id="actualizar-fuma" class="form-control">
          <option value="">¿Fuma?</option>
          <option value="Sí" ${clienteSeleccionado["Fuma"] === "Sí" ? "selected" : ""}>Sí</option>
          <option value="No" ${clienteSeleccionado["Fuma"] === "No" ? "selected" : ""}>No</option>
        </select>
      </div>
    </div>

    <div class="fila-corta">
      <div>
        <label for="actualizar-salario">Salario Anual:</label>
        <input type="number" id="actualizar-salario" placeholder="Salario Anual" value="${clienteSeleccionado["Salario Anual"] || ""}" class="form-control">
      </div>
      <div>
        <label for="actualizar-status">Status:</label>
        <select id="actualizar-status" class="form-control">
          <option value="">Status</option>
          <option value="Permiso de Trabajo" ${clienteSeleccionado["Status"] === "Permiso de Trabajo" ? "selected" : ""}>Permiso de Trabajo</option>
          <option value="Residente" ${clienteSeleccionado["Status"] === "Residente" ? "selected" : ""}>Residente</option>
          <option value="Green Card" ${clienteSeleccionado["Status"] === "Green Card" ? "selected" : ""}>Green Card</option>
          <option value="I-94" ${clienteSeleccionado["Status"] === "I-94" ? "selected" : ""}>I-94</option>
          <option value="Licencia de Conducir" ${clienteSeleccionado["Status"] === "Licencia de Conducir" ? "selected" : ""}>Licencia de Conducir</option>
        </select>
      </div>
    </div>

    <div class="fila-corta">
      <div>
        <label for="actualizar-numero-status">N° Status:</label>
        <input type="text" id="actualizar-numero-status" placeholder="N° Status" value="${clienteSeleccionado["N° Status"] || ""}" class="form-control">
      </div>
      <div>
        <label for="actualizar-sns">SNS:</label>
        <input type="text" id="actualizar-sns" placeholder="SNS" value="${clienteSeleccionado["SNS"] || ""}" class="form-control">
      </div>
    </div>

    <div class="fila-corta">
      <div>
        <label for="actualizar-aseguranza">Aseguranza:</label>
        <input type="text" id="actualizar-aseguranza" placeholder="Aseguranza" value="${clienteSeleccionado["Aseguranza"] || ""}" class="form-control">
      </div>
      <div>
        <label for="actualizar-id-seguro">ID del Seguro:</label>
        <input type="text" id="actualizar-id-seguro" placeholder="ID del Seguro" value="${clienteSeleccionado["ID del Seguro"] || ""}" class="form-control">
      </div>
    </div>

    <label for="actualizar-pago">Pago Mensual:</label>
    <input type="number" step="0.01" id="actualizar-pago" placeholder="Pago Mensual" value="${clienteSeleccionado["Pago Mensual"] || ""}" class="form-control">

   <button type="submit">💾 Guardar Cambios</button>
  </form>
`;

  // Guardar cambios al hacer submit
  const form = document.getElementById("form-actualizar-cliente");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    clienteSeleccionado["Fecha de Nacimiento"] = document.getElementById("actualizar-nacimiento").value;
    clienteSeleccionado["Teléfono"] = document.getElementById("actualizar-telefono").value;
    clienteSeleccionado["Correo"] = document.getElementById("actualizar-correo").value;
    clienteSeleccionado["Dirección"] = document.getElementById("actualizar-direccion").value;
    clienteSeleccionado["Sexo"] = document.getElementById("actualizar-sexo").value;
    clienteSeleccionado["Embarazada"] = document.getElementById("actualizar-embarazada").value;
    clienteSeleccionado["Dependes"] = document.getElementById("actualizar-dependes").value;
    clienteSeleccionado["Fuma"] = document.getElementById("actualizar-fuma").value;
    clienteSeleccionado["Salario Anual"] = document.getElementById("actualizar-salario").value;
    clienteSeleccionado["Status"] = document.getElementById("actualizar-status").value;
    clienteSeleccionado["N° Status"] = document.getElementById("actualizar-numero-status").value;
    clienteSeleccionado["SNS"] = document.getElementById("actualizar-sns").value;
    clienteSeleccionado["Aseguranza"] = document.getElementById("actualizar-aseguranza").value;
    clienteSeleccionado["ID del Seguro"] = document.getElementById("actualizar-id-seguro").value;
    clienteSeleccionado["Pago Mensual"] = document.getElementById("actualizar-pago").value;

    formActualizarDiv.style.display = "none";
    seleccionarCliente(clienteSeleccionado); // Mostrar actualizado
    alert("Cliente actualizado exitosamente 🎉");
});
}

 //********************************************
 // Hacer visibles estas funciones globalmente
 //********************************************
window.mostrarVista = mostrarVista;
window.mostrarVistaEliminados = mostrarVistaEliminados;
window.eliminarCliente = eliminarCliente;
window.mostrarFormularioActualizar = mostrarFormularioActualizar;
window.restaurarCliente = restaurarCliente;
window.exportarAExcel = exportarAExcel;
window.mostrarTabla = mostrarTabla;
window.mostrarTablaEliminados = mostrarTablaEliminados;