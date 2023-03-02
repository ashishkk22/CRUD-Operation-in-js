const regexPatterns = {
  id: /^[1-9][0-9]{4,20}$/,
  name: /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-\s]{2,}$/,
  price: /^[0-9]{1,}$/,
  imgUrl: /^([a-z\-_0-9\/\:\.,]*\.(jpg|jpeg|png|gif|svg))/i,
  description: /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-\s]{10,200}$/,
};

//position of edit btn to find the main from the path with event
const positionOfEditBtn = 3;

//getting the data from local and setting in the obj
let dataFromLocal = getValueFromLocal("products");
export let productObj = {
  products: dataFromLocal ?? [],
};

//validate and send the data if no error or send error
export function validateAndGetData(formElements) {
  const dataObj = {};
  let flagForValidation = 0;
  for (const elem of formElements) {
    const regex = regexPatterns[elem.id];
    if (regex.test(elem.value)) {
      dataObj[elem.id] = elem.value.trim();
      flagForValidation++;
    } else {
      showTheErrorEle(elem.id + "-error");
    }
  }
  if (flagForValidation === Object.keys(regexPatterns).length) {
    return dataObj;
  }
  return;
}

//show the error in the page with show hide
function showTheErrorEle(id) {
  const errEle = document.getElementById(id);
  errEle?.classList.remove("d-none");
  setTimeout(() => {
    errEle?.classList.add("d-none");
  }, 5000);
}

//alert after operation (delete or edit or add)
export function showTheAlertMsg(element, msg, typeOfEvent) {
  element.innerText = msg;
  element.classList.add(typeOfEvent);
  element.classList.remove("collapse");
  setTimeout(() => {
    element.classList.remove(typeOfEvent);
    element.classList.add("collapse");
  }, 5000);
}

//==== local storage related fn ==== //

//set and get the data from the local storage
export function setValueInLocal(key, value) {
  let stringData = JSON.stringify(value);
  localStorage.setItem(key, stringData);
}

//get the values from the local storage
export function getValueFromLocal(key) {
  if (!localStorage.getItem(key)) {
    setValueInLocal(key, "");
    return getValueFromLocal(key);
  } else {
    let dataFromLocal = localStorage.getItem(key);
    dataFromLocal = JSON.parse(dataFromLocal)?.products;
    return dataFromLocal;
  }
}

//iterate with data and set the html in the target div with ID
export function addCardsInDiv(data, divId) {
  let arrOfEle = data?.map(obj => {
    const { description, id, imgUrl, name, price } = obj;
    return `<div class="card border-1 m-3 view__card--size" id="${id}">
    <img
      src="${imgUrl}"
      class="img-fluid m-2 img-card" 
      alt="${name}"
    />
    <div class="card-body">
      <p class="id-card"># ${id}</p>
      <h5 class="card-title name-card">${name}</h5>
      <p class="card-text description-card">
        ${description}
      </p>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item price-card">Price: ${price}</li>
      <li class="list-group-item d-flex justify-content-between">
      <button class="btn btn-dark edit-btns" data-bs-toggle="modal"
  data-bs-target="#exampleModal" >Edit Product</button>
      <button class="btn btn-danger delete-btns">Delete</button>
      </li>
    </ul> 
  </div>`;
  });

  let cardDiv = document.getElementById(divId);
  cardDiv.innerText = "";

  if (arrOfEle !== undefined) {
    for (const i of arrOfEle) {
      cardDiv.insertAdjacentHTML("beforeend", i);
    }
  }
}

//data getter with event from targeted card
export function dataExtractFromCards(e) {
  //getting the main card div with btn parent
  let targetCardDiv = e.composedPath()[positionOfEditBtn];

  //getting the all details imgLink, id, name, description, price
  let imgLink = targetCardDiv.querySelector(".img-card").src;

  let id = targetCardDiv.querySelector(".id-card").innerText;
  id = id.substr(2, id.length);

  let name = targetCardDiv.querySelector(".name-card").innerText;

  let description = targetCardDiv.querySelector(".description-card").innerText;

  let price = targetCardDiv.querySelector(".price-card").innerText;
  price = price.substr(7, price.length);

  return [id, name, imgLink, description, price];
}

//sorting fn with combo of sortBy and Filter value
export function sortAndFilterData(data, filter, sortBy) {
  //checking asc or des
  data.sort((obj1, obj2) => {
    if (sortBy === "asc") {
      if (filter === "name") {
        return obj2[filter].charAt(0).toLowerCase() <
          obj1[filter].charAt(0).toLowerCase()
          ? 1
          : -1;
      }
      return obj1[filter] - obj2[filter];
    } else if (sortBy === "des") {
      if (filter === "name") {
        return obj2[filter].charAt(0).toLowerCase() <
          obj1[filter].charAt(0).toLowerCase()
          ? -1
          : 1;
      }
      return obj2[filter] - obj1[filter];
    }
  });
  return data;
}
