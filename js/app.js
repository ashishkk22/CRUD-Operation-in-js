import {
  setValueInLocal,
  getValueFromLocal,
  productObj,
  validateAndGetData,
  showTheAlertMsg,
  addCardsInDiv,
  dataExtractFromCards,
  sortAndFilterData,
} from "./functions.js";

const pageTitle = "Product Management System";

// object with template location and title
const routes = {
  "/": {
    template: "/templates/index.html",
    title: "Home | " + pageTitle,
  },
  products: {
    template: "/templates/products.html",
    title: "Products | " + pageTitle,
  },
  addProduct: {
    template: "/templates/addProduct.html",
    title: "Add Product | " + pageTitle,
  },
  404: {
    template: "/templates/404.html",
    title: "404 not found | " + pageTitle,
  },
};

// watch the hash and call the fn
window.addEventListener("hashchange", locationHandler);
locationHandler();

//called on every location change
function locationHandler() {
  let location = window.location.hash.replace("#", "");
  //if length 0 then main route
  if (location.length === 0) {
    location = "/";
  }
  // route object from routes
  const route = routes[location] || routes["404"];

  // set the page title
  document.title = route.title;

  // get the html from the template
  if (location === "/") {
    mainRoute(route);
  } else if (location === "products") {
    productsRoute(route);
  } else if (location === "addProduct") {
    addProductRoute(route);
  } else if (location) {
    notFoundRoute(route);
  }
}

// ============================================ //
function generator() {
  return "CRUD" + new Date().getTime() + "-";
}
//main page fn
async function mainRoute(route) {
  const html = await fetch(route.template).then(response => response.text());
  document.getElementById("root").innerHTML = html;
}

async function productsRoute(route) {
  //getting html from the file
  const html = await fetch(route.template).then(response => response.text());

  //setting fetched html in the root div
  const root = document.getElementById("root");
  root.innerHTML = html;

  let initialHtml;

  //getting data from local and checking empty or not
  let previousData = getValueFromLocal("products");
  if (previousData?.length === 0 || previousData == undefined) {
    initialHtml = `<p class="text-center m-5">You don't have any Products to view, Please add products !</p>`;
    root.insertAdjacentHTML("beforeend", initialHtml);
    return;
  }

  //generating the uuid so if no references pointing to div on calling the mainRoute() recursively then the garbage collector will collects the previous events
  const uuid = generator() + "card-of-product";

  initialHtml = `<div class="d-flex  flex-wrap justify-content-center" id=${uuid}></div>`;

  //adding the div in root
  root.insertAdjacentHTML("beforeend", initialHtml);

  //adding the card in the above added div
  addCardsInDiv(previousData, uuid);

  //selecting the from, update product and filter elements to perform the operations
  const form = document.querySelector("form");
  const editProduct = document.getElementById("update-the-product");
  const selectionFilter = document.getElementById("filter-select");
  const selectionSortBy = document.getElementById("sortBy-select");
  const searchField = document.getElementById("search-field");
  const wholeDiv = document.getElementById(uuid);

  //obj to decide the how data to be filtered
  let objShow = {
    filter: "id",
    sortBy: "asc",
  };

  //update the card div based on the filter selection change
  selectionFilter.addEventListener("change", e => {
    objShow.filter = e.target.value ?? "id";
    cardRelatedOperation(objShow);
  });

  //debounce polyfill
  let timer;
  function myDebounce(cb, d) {
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        cb(...args);
      }, d);
    };
  }

  //update the card div based on the search field input
  searchField.addEventListener("keydown", () => {
    //new fn with debounce
    const cardRelatedOperationDebounce = myDebounce(objShow => {
      cardRelatedOperation(objShow);
    }, 800);
    cardRelatedOperationDebounce(objShow);
  });

  //update the card div based on the sortBy selection change
  selectionSortBy.addEventListener("change", e => {
    objShow.sortBy = e.target.value ?? "asc ";
    cardRelatedOperation(objShow);
  });

  //after every sort or filter or search this fn is going to be called
  function cardRelatedOperation({ filter, sortBy }) {
    //getting existing data
    previousData = getValueFromLocal("products");

    //if user has searched any thing do data filtration
    if (searchField.value?.length > 0) {
      //updating the filtered data
      previousData = previousData.filter(obj => {
        return obj.id.includes(searchField.value);
      });
    }

    //new data based on the selection (filter & sortBy) and updating in main div
    const newData = sortAndFilterData(previousData, filter, sortBy);
    addCardsInDiv(newData, uuid);

    //adding listener to whole div (EVENT DELEGATION)
    wholeDiv.addEventListener("click", e => {
      //if clicked btn (from card) is edit btn
      if (e.target.classList.contains("edit-btns")) {
        //getting data from fn
        const [id, name, imgLink, description, price] = dataExtractFromCards(e);

        //set the value in the modal (form)
        document.getElementById("id").value = id;
        document.getElementById("id").disabled = true;
        document.getElementById("imgUrl").value = imgLink;
        document.getElementById("name").value = name;
        document.getElementById("description").value = description;
        document.getElementById("price").value = price;
      }
      //to delete the product
      else if (e.target.classList.contains("delete-btns")) {
        //getting the card data from extractor fn
        const [id] = dataExtractFromCards(e);
        const dataFromLocal = getValueFromLocal("products");

        //data filter based on the id
        const newData = dataFromLocal.filter(obj => {
          return obj.id !== id;
        });
        productObj.products = newData;
        setValueInLocal("products", productObj);

        //alert on the operation
        const deleteMsg = document.getElementById("action-alert");
        showTheAlertMsg(
          deleteMsg,
          "A Product Deleted Successfully !!",
          "alert-danger"
        );
        productsRoute(route);
      }
    });

    //edit btn of the form where user entering the updated value
    editProduct.addEventListener("click", () => {
      //getting from element and validating with the fn
      const formElements = document.querySelector("form").elements;
      const dataObj = validateAndGetData(formElements);

      if (dataObj != undefined) {
        const dataFromLocal = getValueFromLocal("products");

        //swapping the old object with new object based on the id
        const newData = dataFromLocal.map(obj => {
          return obj.id === dataObj.id ? dataObj : obj;
        });
        productObj.products = newData;
        setValueInLocal("products", productObj);
        form.reset();
        addCardsInDiv(newData, uuid);

        setTimeout(() => {
          document.getElementById("close-btn").click();
          productsRoute(route);
          const updateMsg = document.getElementById("action-alert");
          showTheAlertMsg(
            updateMsg,
            "A Product Updated Successfully !!",
            "alert-success"
          );
        }, 200);
      }
    });
  }
  cardRelatedOperation(objShow);
}

async function addProductRoute(route) {
  const html = await fetch(route.template).then(response => response.text());

  // set the content of the content div to the html
  document.getElementById("root").innerHTML = html;
  const submitFormBtn = document.getElementById("submit-form");
  const form = document.querySelector("form");

  //addedProduct submit btn
  submitFormBtn?.addEventListener("click", () => {
    const formElements = document.querySelector("form").elements;
    const dataObj = validateAndGetData(formElements);
    if (dataObj != undefined) {
      //pushing in the array of object
      productObj.products.push(dataObj);
      setValueInLocal("products", productObj);
      form.reset();
      const successMsg = document.getElementById("action-alert");
      showTheAlertMsg(
        successMsg,
        "A Product added successfully !!",
        "alert-success"
      );
    }
  });
}

async function notFoundRoute(route) {
  const html = await fetch(route.template).then(response => response.text());

  // set the content of the content div to the html
  document.getElementById("root").innerHTML = html;
}
