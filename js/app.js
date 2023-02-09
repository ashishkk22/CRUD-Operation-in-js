import {
  setValueInLocal,
  getValueFromLocal,
  productObj,
  validateAndGetData,
  showTheAlertMsg,
  addCardsInDiv,
  dataExtractFromCards,
  selectObj,
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
    title: "products | " + pageTitle,
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

function locationHandler() {
  var location = window.location.hash.replace("#", "");
  //if length 0 then main route
  if (location.length == 0) {
    location = "/";
  }
  // route object from routes
  const route = routes[location] || routes["404"];

  // set the page title
  document.title = route.title;

  // get the html from the template
  if (location == "/") {
    mainRoute(route);
  } else if (location == "products") {
    productsRoute(route);
  } else if (location == "addProduct") {
    productRoute(route);
  } else if (location) {
    notFoundRoute(route);
  }
}

// ============================================ //

async function mainRoute(route) {
  const html = await fetch(route.template).then(response => response.text());
  document.getElementById("root").innerHTML = html;
}

async function productsRoute(route, filter = 0, sort = 0) {
  console.log("hiii rendered");
  const html = await fetch(route.template).then(response => response.text());
  let root = document.getElementById("root");
  root.innerHTML = html;

  let initialHtml;

  let previousData = getValueFromLocal("products");
  console.log(previousData);
  if (previousData.length === 0) {
    // previousData = JSON.parse(dataFromLocal)?.products;
    // console.log(previousData);
    initialHtml = `<p class="text-center m-5">You don't have any Products to view, Please add it !</p>`;
    root.insertAdjacentHTML("beforeend", initialHtml);
    return;
  }

  initialHtml = `<div class="controls d-flex flex-column flex-md-row w-100 gap-2">
  <div class="d-flex gap-1 justify-content-center align-content-center p-2">
    <label class="m-2 text-nowrap">Filter :</label>
    <select
      class="form-select"
      aria-label="Default select example"
      id="filter-select"
    >
      <option selected value="id" >Id</option>
      <option value="price">Price</option>
      <option value="name">Name</option>
    </select>
  </div>
  <div class="d-flex gap-1 justify-content-center align-content-center p-2">
    <label class="m-2 text-nowrap">Sort By:</label>
    <select
      class="form-select select-picker"
      aria-label="Default select example"
    >
      <option selected>Asc</option>
      <option value="1">des</option>
    </select>
  </div>
</div>
<div class="d-flex  flex-wrap" id="cards-of-product"></div>`;
  root.insertAdjacentHTML("beforeend", initialHtml);

  addCardsInDiv(previousData, "cards-of-product");
  const sectionFilter = document.getElementById("filter-select");
  sectionFilter.selectedIndex = selectObj[sectionFilter.value];
  sectionFilter.addEventListener("change", e => {
    // if (e.target= e.currentTarget) {
    console.log(e.target.value);
    console.log(selectObj[e.target.value]);

    // for(previousData)
    // }
    // console.log("clicked");
  });

  let wholeDiv = document.getElementById("cards-of-product");
  wholeDiv.addEventListener("click", e => {
    //to edit the products
    if (e.target.classList.contains("edit-btns")) {
      const [id, name, imgLink, description, price] = dataExtractFromCards(e);

      //set the value in the modal (form)
      document.getElementById("id").value = id;
      document.getElementById("id").disabled = true;
      document.getElementById("imgUrl").value = imgLink;
      document.getElementById("name").value = name;
      document.getElementById("description").value = description;
      document.getElementById("price").value = price;
    } //to delete the product
    else if (e.target.classList.contains("delete-btns")) {
      //getting the card data from extractor fn
      const [id] = dataExtractFromCards(e);
      let dataFromLocal = getValueFromLocal("products");
      const newData = dataFromLocal.filter(obj => {
        return obj.id !== id;
      });
      productObj.products = newData;
      setValueInLocal("products", productObj);
      let deleteMsg = document.getElementById("action-alert");
      showTheAlertMsg(
        deleteMsg,
        "A Product Deleted Successfully !!",
        "alert-danger"
      );
      productsRoute(route);
    }
  });

  const form = document.querySelector("form");
  let editProduct = document.getElementById("update-the-product");
  editProduct.addEventListener("click", () => {
    const formElements = document.querySelector("form").elements;
    const dataObj = validateAndGetData(formElements);
    if (dataObj !== undefined) {
      let dataFromLocal = getValueFromLocal("products");
      const newData = dataFromLocal.map(obj => {
        return obj.id === dataObj.id ? dataObj : obj;
      });
      productObj.products = newData;
      setValueInLocal("products", productObj);
      form.reset();
      addCardsInDiv(newData, "cards-of-product");

      setTimeout(() => {
        document.getElementById("close-btn").click();
        productsRoute(route);
      }, 200);
    }
  });
}

async function productRoute(route) {
  const html = await fetch(route.template).then(response => response.text());

  // set the content of the content div to the html
  document.getElementById("root").innerHTML = html;
  let submitFormBtn = document.getElementById("submit-form");
  let form = document.querySelector("form");

  submitFormBtn?.addEventListener("click", () => {
    const formElements = document.querySelector("form").elements;
    const dataObj = validateAndGetData(formElements);
    if (dataObj !== undefined) {
      productObj.products.push(dataObj);
      setValueInLocal("products", productObj);
      form.reset();
      let successMsg = document.getElementById("action-alert");
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
