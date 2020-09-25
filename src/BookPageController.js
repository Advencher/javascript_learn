export class BookPageController {
  reservationsButton = document.getElementById("button__reservations");
  journalButton = document.getElementById("button__journal__readers");
  readersTable = document.querySelector(".readers__table");
  submit = document.querySelector(".book-forms__button");
  formBorrowing = document.querySelector(".borrow-book");

  constructor(libraryController) {
    this.libraryController = libraryController;
    if (!localStorage.getItem("currentUser"))
      this.formBorrowing.setAttribute("hidden", "true");
    else this.formBorrowing.setAttribute("hidden", "false");
    this.book = JSON.parse(localStorage.getItem("currentBook"));
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

    this.reservationsButton.addEventListener(
      "click",
      this.displayReservations.bind(this)
    );
    this.journalButton.addEventListener(
      "click",
      this.displayReaders.bind(this)
    );
    this.submit.addEventListener("click", this.submitBooks.bind(this));
  }

  displayRequestedBook() {
    const bookCover = document.querySelector(".book-description__cover");
    bookCover.setAttribute("src", this.book.image);
    const bookTitle = document.querySelector(".book-description__title");
    bookTitle.innerText = this.book.title;
    const bookAuthor = document.querySelector(".book-description__author");
    bookAuthor.innerText = this.book.author;
    const bookYear = document.querySelector(".book-description__year");
    bookYear.innerText = this.book.year;
    const bookAnnotation = document.querySelector(
      ".book-description__annotation"
    );
    bookAnnotation.innerText = this.book.description;
  }

  displayReservations() {
    const defaultTbody = document.getElementsByTagName("tbody")[0];
    const tblBody = document.createElement("tbody");
    this.journalButton.classList.remove("chosen");
    this.reservationsButton.className = "chosen";
    document.getElementById("mark__for__unique").innerHTML = "";
    let reserv = this.libraryController.getReservations(this.book.id).reverse();
    reserv.forEach((user) => {
      let newRow = document.createElement("tr");
      newRow.innerHTML = `<td>${user.userObj.login}</td><td>${user.amount}</td>`;
      tblBody.appendChild(newRow);
    });
    this.readersTable.replaceChild(tblBody, defaultTbody);
  }

  displayReaders() {
    this.journalButton.className = "chosen";
    this.reservationsButton.classList.remove("chosen");
    this.displayTable(
      this.libraryController.libraryJournal.usersForBook(this.book.id)
    );
    document.getElementById("mark__for__unique").innerHTML =
      "Day of returning books";
  }

  displayTable(arrayData) {
    const defaultTbody = document.getElementsByTagName("tbody")[0];
    const tblBody = document.createElement("tbody");
    arrayData.reverse();

    arrayData.forEach((entry) => {
      let newRow = document.createElement("tr");
      newRow.innerHTML = `<td>${entry.user.login}</td><td>${
        entry.amount
      }</td><td>${new Date(entry.date)}</td>`;
      tblBody.appendChild(newRow);
    });
    this.readersTable.replaceChild(tblBody, defaultTbody);
  }

  submitBooks() {
    let copiesField = document.getElementById("copiesToBorrow");
    let dateField = document.getElementById("borrowDate");
    let date = new Date(dateField.value);
    let numerOfCopies = parseInt(copiesField.value, 10);
    let enter = this.libraryController.resolveEntryToJournal(
      this.book.id,
      this.currentUser,
      date,
      numerOfCopies
    );
    if (enter === "too__many") alert("Too many books for one user");
    else if (enter === "over_capacity") alert("Storage capacity violation");
    else if (enter === "queue") alert("You've been sent to queue");
    else alert("Книга успешно взята");
  }
}
