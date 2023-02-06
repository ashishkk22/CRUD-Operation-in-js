// const addMovieModal = document.getElementById("add-modal");

// // const addMovieModal = document.querySelector('add-model'); // above and this expression are same

// const startAddMovieButton = document.querySelector("header button"); // or
// // const startAddMovieButton = document.querySelector('header').lastElementChild;

// const backdrop = document.getElementById("backdrop");

// const cancelAddMovieButton = addMovieModal.querySelector(".btn--passive");
// const confirmAddMovieButton = cancelAddMovieButton.nextElementSibling;
// const userInputs = addMovieModal.querySelectorAll("input");

// const entryTextSection = document.getElementById("entry-text");
// const deleteMovieModal = document.getElementById("delete-modal");

// const movies = [];

// const updateUI = () => {
//   if (movies.length === 0) {
//   } else {
//     entryTextSection.style.display = "none";
//   }
// };

// const deleteMovie = movieId => {
//   let movieIndex = 0;
//   for (const movie of movies) {
//     if (movie.id === movieId) {
//       break;
//     }
//     movieIndex++;
//   }
//   console.log(movieIndex);
//   movies.splice(movieIndex, 1);
//   const listRoot = document.getElementById("movie-list");
//   listRoot.children[movieIndex].remove();
//   // listRoot.removeChild(listRoot.children[movieIndex]);
// };

// const closeMovieDeletionModal = () => {
//   toggleBackDrop();
//   deleteMovieModal.classList.remove("visible");
// };

// const deleteMovieHandler = movieId => {
//   deleteMovieModal.classList.add("visible");
//   toggleBackDrop();
//   deleteMovie(movieId);
// };

// const renderNewMovieElement = ({ id, title, imageUrl, rating }) => {
//   const newMovieElement = document.createElement("li");
//   newMovieElement.className = "movie-element";
//   newMovieElement.innerHTML = `
//         <div class="movie-element__image"><img src="${imageUrl}" alt="${title}"/></div>
//         <div class="movie-element__info"><h2>${title}</h2> <p>${rating}/5 stars</p></div>
//     `;
//   newMovieElement.addEventListener("click", deleteMovieHandler.bind(null, id));
//   const listRoot = document.getElementById("movie-list");
//   listRoot.append(newMovieElement);
// };

// const toggleBackDrop = () => {
//   backdrop.classList.toggle("visible");
// };

// const closeMovieModal = () => {
//   addMovieModal.classList.remove("visible");
// };

// const showMovieModal = () => {
//   addMovieModal.classList.add("visible");
//   toggleBackDrop();
// };

// const backdropClickHandler = () => {
//   closeMovieModal();
//   closeMovieDeletionModal();
// };

// const clearMovieInput = () => {
//   for (const userInput of userInputs) {
//     userInput.value = "";
//   }
// };

// const cancelAddMovieHandler = () => {
//   closeMovieModal();
//   clearMovieInput();
// };

// const addMovieHandler = () => {
//   const titleValue = userInputs[0].value;
//   const imageUrlValue = userInputs[1].value;
//   const ratingValue = userInputs[2].value;

//   if (
//     titleValue.trim() === "" || //it removes the empty space from the string
//     imageUrlValue.trim() === "" ||
//     ratingValue.trim() === "" ||
//     +ratingValue < 1 ||
//     +ratingValue > 5
//   ) {
//     alert("Please enter the valid values (rating between 1 and 5).");
//     clearMovieInput();
//     return;
//   }

//   const newMovie = {
//     id: Math.random().toString(),
//     title: titleValue,
//     image: imageUrlValue,
//     rating: ratingValue,
//   };
//   movies.push(newMovie);
//   closeMovieModal();
//   toggleBackDrop();
//   clearMovieInput();
//   updateUI();
//   renderNewMovieElement(newMovie);
// };

// startAddMovieButton.addEventListener("click", showMovieModal);
// backdrop.addEventListener("click", backdropClickHandler);
// cancelAddMovieButton.addEventListener("click", cancelAddMovieHandler);
// confirmAddMovieButton.addEventListener("click", addMovieHandler);

// const inputs = document.querySelectorAll("input");

// const patterns = {
//   username: /^[a-z\d]{5,12}$/i,
//   password: /^[\d\w@-]{8,20}$/i,
//   email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
//   phone: /^\d{3}-\d{3}-\d{4}$/,
// };

// inputs.forEach(input => {
//   input.addEventListener("keyup", e => {
//     validate(e.target, patterns[e.target.attributes.id.value]);
//   });
// });

// function validate(field, regex) {
//   if (regex.test(field.value)) {
//     field.className = "form-control valid";
//   } else {
//     field.className = "form-control invalid";
//   }
// }

// let productId = document.getElementById("product-id");
// let productName = document.getElementById("product-name");
// let productImage = document.getElementById("product-image");
// let productDescription = document.getElementById("product-image");

const regexPatterns = {
  id: /^[1-9][0-9]{4,20}$/,
  name: /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-\s]{2,}$/,
  imgUrl: /^([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))$/,
  description: /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-\s]{10,200}$/,
};

let submitFormBtn = document.getElementById("submit-form");
submitFormBtn.addEventListener("click", () => {
  const dataObj = {};
  let validationErr = false;
  const formElements = document.querySelector("form").elements;
  for (const elem of formElements) {
    const regex = regexPatterns[elem.id];
    if (regex.test(elem.value)) {
      dataObj[elem.id] = elem.value;
    } else {
      validationErr = false; //do something
      showErrorInTheForm(elem);
    }
  }
  console.log("after vlidaton");
  if (validationErr) {
    console.log("insidethe if");
    dataValidation(dataObj);
  }
});

function dataValidation(dataObj) {
  console.log("hiii", dataObj);
}

function showErrorInTheForm(idOfInput) {
  switch (idOfInput.id) {
    case "id":
      console.log("in the id");
      showTheErrorEle("id-error");
      break;
    case "name":
      showTheErrorEle("name-error");
      break;
    case "imgUrl":
      showTheErrorEle("img-error");
      break;
    case "description":
      showTheErrorEle("description-error");
      break;
    default:
      console.log("default");
  }
}

function showTheErrorEle(id) {
  const errEle = document.getElementById(id);
  errEle.classList.remove("d-none");
  setTimeout(() => {
    errEle.classList.add("d-none");
  }, 5000);
}
