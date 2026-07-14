const form = document.getElementById("library-form");
const bookList = document.getElementById("book-list");
const bookCount = document.getElementById("book-count");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-edit");

const books = [];
let editIndex = null;

function updateBookCount() {
    const count = books.length;
    bookCount.textContent = `${count} libro${count === 1 ? "" : "s"}`;
}

function renderBooks() {
    bookList.innerHTML = "";

    if (books.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "No hay libros registrados aún.";
        bookList.appendChild(empty);
        return;
    }

    books.forEach((book, index) => {
        const card = document.createElement("article");
        card.className = "book-card";

        const title = document.createElement("h3");
        title.textContent = book.title;

        const author = document.createElement("p");
        author.textContent = `Autor: ${book.author}`;

        const meta = document.createElement("div");
        meta.className = "book-meta";
        meta.innerHTML = `
            <span>Género: ${book.genero}</span>
            <span>Año: ${book.año}</span>
            <span>Ingreso: ${book.entryDate}</span>
            <span>ID: ${index + 1}</span>
        `;

        const registrar = document.createElement("p");
        registrar.className = "book-notes";
        registrar.textContent = `Registrado por: ${book.registrar}`;

        const notes = document.createElement("p");
        notes.className = "book-notes";
        notes.textContent = book.notas ? book.notas : "Sin notas adicionales.";

        const actions = document.createElement("div");
        actions.className = "book-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "btn btn-small";
        editButton.textContent = "Editar";
        editButton.addEventListener("click", () => startEditBook(index));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn btn-small btn-secondary";
        deleteButton.textContent = "Eliminar";
        deleteButton.addEventListener("click", () => deleteBook(index));

        actions.append(editButton, deleteButton);
        card.append(title, author, meta, registrar, notes, actions);
        bookList.appendChild(card);
    });
}

function populateForm(book) {
    form.title.value = book.titulo;
    form.author.value = book.autor;
    form.year.value = book.año;
    form.entryDate.value = book.entryDate;
    form.registrar.value = book.registrar;
    form.genre.value = book.genero;
    form.notes.value = book.notas;
}

function resetForm() {
    form.reset();
    editIndex = null;
    submitBtn.textContent = "Agregar libro";
    cancelBtn.hidden = true;
    form.querySelector("input").focus();
}

function startEditBook(index) {
    editIndex = index;
    populateForm(books[index]);
    submitBtn.textContent = "Guardar cambios";
    cancelBtn.hidden = false;
}

function deleteBook(index) {
    books.splice(index, 1);
    renderBooks();
    updateBookCount();
    if (editIndex === index) {
        resetForm();
    } else if (editIndex !== null && editIndex > index) {
        editIndex -= 1;
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const newBook = {
        title: formData.get("title").trim(),
        author: formData.get("author").trim(),
        year: formData.get("year").trim(),
        entryDate: formData.get("entryDate"),
        registrar: formData.get("registrar").trim(),
        genre: formData.get("genre").toString(),
        notes: formData.get("notes").trim(),
    };

    if (editIndex === null) {
        books.push(newBook);
    } else {
        books[editIndex] = newBook;
    }

    renderBooks();
    updateBookCount();
    resetForm();
});

cancelBtn.addEventListener("click", resetForm);

updateBookCount();
renderBooks();