import { TodoItem } from "./todoItem.js";
import { TodoCollection } from "./todoCollections.js";

let todos: TodoItem[] = [
    new TodoItem(1, "Buy Flowers"), new TodoItem(2, "Get Shoes"),
    new TodoItem(3, "Collect Tickets"), new TodoItem(4, "Call Joe", true)];

let collection: TodoCollection = new TodoCollection("Adam", todos);


function renderTodoTable(): void {

    //Visualizarlo en consola

    console.log(`${collection.userName}'s Todo List `
        + `(${ collection.getItemCounts().incomplete } items to do)`);
    collection.getTodoItems(true).forEach(item => item.printDetails());

    const contenedor = document.getElementById("todo-list")!;
    contenedor.innerHTML = ""; // Limpiar el contenedor

    // Titulo tabla
    const title = document.createElement("h2");
    title.className = "text-center mb-4";
    title.textContent = `${collection.userName}'s Todo List (${ collection.getItemCounts().incomplete } items to do)`;
    contenedor.appendChild(title);

    // Crear la tabla
    const table = document.createElement("table");
    table.className = "table table-striped";

    // Cabecera tabla
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Task</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    `;
    table.appendChild(thead);

    // Cuerpo tabla
    const tbody = document.createElement("tbody");
    collection.getTodoItems(true).forEach(item => {
        const tr = document.createElement("tr");
        const etiquetaEstado = `<span class="badge fs-6 ${item.complete ? 'bg-success' : 'bg-warning'}">
                                ${item.complete ? "Completado" : "Pendiente"}
                             </span>`;
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.task}</td>
            <td>${etiquetaEstado}</td>
            <td>
                <button class="btn fs-6 btn-sm btn-secondary toggle-complete" data-id="${item.id}">
                    ${item.complete ? "Marcar Incompleto" : "Marcar Completo"}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    contenedor.appendChild(table);

    // Agregar nueva tarea
    const form = document.createElement("form");
    form.className = "mt-3";
    form.innerHTML = `
      <div class="input-group">
          <input type="text" id="new-todo" class="form-control" placeholder="Nueva tarea" required>
          <button class="btn btn-primary" type="submit">Agregar</button>
      </div>
    `;
    contenedor.appendChild(form);

    // Botón para eliminar tareas completadas
    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-danger mt-3";
    removeButton.textContent = "Eliminar Completadas";
    contenedor.appendChild(removeButton);

    // Evento para agregar una nueva tarea
    form.addEventListener("submit", event => {
        event.preventDefault();
        const input = document.getElementById("new-todo") as HTMLInputElement;
        if (input.value.trim() !== "") {
            collection.addTodo(input.value.trim());
            input.value = "";
            renderTodoTable(); // Actualiza la tabla
        }
    });

    // Evento para eliminar todas las tareas completadas
    removeButton.addEventListener("click", () => {
        collection.removeComplete();
        renderTodoTable();
    });

    // Eventos para alternar el estado de cada tarea (completa/incompleta)
    table.querySelectorAll(".toggle-complete").forEach(button => {
        button.addEventListener("click", () => {
            const idStr = (button as HTMLButtonElement).getAttribute("data-id");
            if (idStr) {
                const id = parseInt(idStr, 10);
                const item = collection.getTodoById(id);
                if (item) {
                    collection.markComplete(id, !item.complete);
                    renderTodoTable();
                }
            }
        });
    });
}

renderTodoTable();
