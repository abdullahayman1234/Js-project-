function Author(name, email) {
    this.name = name;
    this.email = email;
}

function Book(name, price, author) {
    this.name = name;
    this.price = price;
    this.author = author;
}

var btn = document.querySelector(".btn");
var btn1 = document.querySelector(".btn1");
var value = -1;
var input = document.querySelector(".in1");
var numberRegex = /^\d+$/;
var noofbooks = document.getElementById('no_book_validation');
var p_names = document.getElementById('book_name_validation');
var p_price = document.getElementById('price');
var p_author = document.getElementById('book_author_validation');
var p_email = document.getElementById('book_email_validation');
var book = [];

if (btn) {
    btn.addEventListener("click", function () {
        if (!numberRegex.test(input.value) || input.value <= 0) {
            noofbooks.textContent = "Wrong number validation";
            noofbooks.style.color = "red";
        } else {
            value = input.value;
            window.location.href = "form.html?value=" + value;
        }
    });
}

var emailv = false;
var namev = false;
var pricev = false;
var authorv = false;
var Email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var price_pattern = /^[0-9]+$/;
var name_pattern = /^[a-zA-Z\s]+$/;

var namevalidation = document.getElementById('bookName');
var pricevalidation = document.getElementById('book_price_validation');
var authorvalidation = document.getElementById('authorname');
var emailvalidation = document.getElementById('email');

var temp = 0;

if (btn1) {
    btn1.addEventListener("click", function () {
        p_names.textContent = "";
        p_price.textContent = "";
        p_author.textContent = "";
        p_email.textContent = "";
        
        namev = false;
        pricev = false;
        authorv = false;
        emailv = false;

        if (name_pattern.test(namevalidation.value)) {
            namev = true;
        } else {
            p_names.textContent = "Wrong name validation";
        }

        if (price_pattern.test(pricevalidation.value)) {
            pricev = true;
        } else {
            p_price.textContent = "Wrong price validation";
        }

        if (name_pattern.test(authorvalidation.value)) {
            authorv = true;
        } else {
            p_author.textContent = "Wrong author validation";
        }

        if (Email_pattern.test(emailvalidation.value)) {
            emailv = true;
        } else {
            p_email.textContent = "Wrong email validation";
        }

        if (namev && pricev && authorv && emailv) {
            var author = new Author(authorvalidation.value, emailvalidation.value);
            var books = new Book(namevalidation.value, pricevalidation.value, author);
            book.push(books);
            temp++;

            namevalidation.value = "";
            pricevalidation.value = "";
            authorvalidation.value = "";
            emailvalidation.value = "";
            p_names.textContent = "";
            p_price.textContent = "";
            p_author.textContent = "";
            p_email.textContent = "";

            const params = new URLSearchParams(window.location.search);
            const v = params.get("value");
            if (temp == v) {
                document.querySelector(".div1").style.display = "none";
                document.querySelector(".div2").style.display = "block";
                var tableBody = document.getElementById('bookTableBody');
                tableBody.innerHTML = "";
                book.forEach(function(book, index) {
                    var newRow = tableBody.insertRow();
                    newRow.innerHTML = `
                        <td>${book.name}</td>
                        <td>${book.price}$</td>
                        <td>${book.author.name}</td>
                        <td>${book.author.email}</td>
                        <td>
                            <button class="editBtn" onclick="editBook(${index})">Edit</button>
                            <button class="deleteBtn" onclick="deleteBook(${index})">Delete</button>
                        </td>
                    `;
                });
            }
        }
    });
}

namevalidation.addEventListener('input', function() {
    if (name_pattern.test(this.value)) {
        p_names.textContent = "";
    }
});

pricevalidation.addEventListener('input', function() {
    if (price_pattern.test(this.value)) {
        p_price.textContent = "";
    }
});

authorvalidation.addEventListener('input', function() {
    if (name_pattern.test(this.value)) {
        p_author.textContent = "";
    }
});

emailvalidation.addEventListener('input', function() {
    if (Email_pattern.test(this.value)) {
        p_email.textContent = "";
    }
});

function editBook(index) {
    var row = document.getElementById('bookTableBody').rows[index];
    var editButton = row.querySelector('.editBtn');
    var deleteButton = row.querySelector('.deleteBtn');
    var bookData = book[index];

    if (editButton.textContent === "Edit") {
        editButton.textContent = "Save";
        deleteButton.textContent = "Cancel";

        row.dataset.originalName = bookData.name;
        row.dataset.originalPrice = bookData.price;
        row.dataset.originalAuthorName = bookData.author.name;
        row.dataset.originalAuthorEmail = bookData.author.email;

        row.cells[0].innerHTML = `<input type="text" value="${bookData.name}" id="editName${index}">`;
        row.cells[1].innerHTML = `<input type="number" value="${bookData.price}" id="editPrice${index}">`;
        row.cells[2].innerHTML = `<input type="text" value="${bookData.author.name}" id="editAuthorName${index}">`;
        row.cells[3].innerHTML = `<input type="email" value="${bookData.author.email}" id="editAuthorEmail${index}">`;

        deleteButton.onclick = function() { cancelEdit(index); };
    } else {
        var newName = document.getElementById(`editName${index}`).value;
        var newPrice = document.getElementById(`editPrice${index}`).value;
        var newAuthorName = document.getElementById(`editAuthorName${index}`).value;
        var newAuthorEmail = document.getElementById(`editAuthorEmail${index}`).value;

        var nameValid = name_pattern.test(newName);
        var priceValid = price_pattern.test(newPrice);
        var authorNameValid = name_pattern.test(newAuthorName);
        var emailValid = Email_pattern.test(newAuthorEmail);

        if (nameValid && priceValid && authorNameValid && emailValid) {
            book[index] = new Book(newName, newPrice, new Author(newAuthorName, newAuthorEmail));

            row.cells[0].textContent = newName;
            row.cells[1].textContent = `${newPrice}$`;
            row.cells[2].textContent = newAuthorName;
            row.cells[3].textContent = newAuthorEmail;

            editButton.textContent = "Edit";
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function() { deleteBook(index); };
        } else {
            alert("Please enter valid data for all fields.");
        }
    }
}

function cancelEdit(index) {
    var row = document.getElementById('bookTableBody').rows[index];
    var editButton = row.querySelector('.editBtn');
    var deleteButton = row.querySelector('.deleteBtn');

    row.cells[0].textContent = row.dataset.originalName;
    row.cells[1].textContent = `${row.dataset.originalPrice}$`;
    row.cells[2].textContent = row.dataset.originalAuthorName;
    row.cells[3].textContent = row.dataset.originalAuthorEmail;

    editButton.textContent = "Edit";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() { deleteBook(index); };
}

function deleteBook(index) {
    book.splice(index, 1);
    var tableBody = document.getElementById('bookTableBody');
    tableBody.innerHTML = "";
    book.forEach(function(book, index) {
        var newRow = tableBody.insertRow();
        newRow.innerHTML = `
            <td>${book.name}</td>
            <td>${book.price}$</td>
            <td>${book.author.name}</td>
            <td>${book.author.email}</td>
            <td>
                <button class="editBtn" onclick="editBook(${index})">Edit</button>
                <button class="deleteBtn" onclick="deleteBook(${index})">Delete</button>
            </td>
        `;
    });
}