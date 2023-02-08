import {
  setValueInLocal,
  getValueFromLocal,
  productObj,
  validateAndGetData,
  showTheAlertMsg,
  addCardsInDiv,
} from "./functions.js";

const pageTitle = "Product Management System";

//position of edit btn to find the main from the path with event
const positionOfEditBtn = 3;

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

async function productsRoute(route) {
  const html = await fetch(route.template).then(response => response.text());
  let root = document.getElementById("root");
  root.innerHTML = html;

  let initialHtml;

  let previousData = getValueFromLocal("products");

  if (previousData === undefined) {
    // previousData = JSON.parse(dataFromLocal)?.products;
    // console.log(previousData);
    initialHtml = `<p class="text-center m-5">You don't have any Products to view, Please add it !</p>`;
    root.insertAdjacentHTML("beforeend", initialHtml);
    return;
  }

  initialHtml = `<div class="d-flex  flex-wrap" id="cards-of-product"></div>`;
  root.insertAdjacentHTML("beforeend", initialHtml);
  addCardsInDiv(previousData, "cards-of-product");

  //all the edit btn of products
  let allTheEditBtns = document.querySelectorAll(".edit-btns");

  //adding listener to every edit btn of card
  allTheEditBtns.forEach(box =>
    box.addEventListener("click", e => {
      //getting the main card div with btn parent
      let targetCardDiv = e.composedPath()[positionOfEditBtn];

      //getting the all details
      let imgLink = targetCardDiv.querySelector(".img-card").src;
      let id = targetCardDiv.querySelector(".id-card").innerText;
      id = id.substr(2, id.length);
      let name = targetCardDiv.querySelector(".name-card").innerText;
      let description =
        targetCardDiv.querySelector(".description-card").innerText;
      let price = targetCardDiv.querySelector(".price-card").innerText;
      price = price.substr(7, price.length);

      //set the value in the modal (form)
      document.getElementById("id").value = id;
      document.getElementById("id").disabled = true;
      document.getElementById("imgUrl").value = imgLink;
      document.getElementById("name").value = name;
      document.getElementById("description").value = description;
      document.getElementById("price").value = price;
    })
  );
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
      }, 400);
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
      showTheAlertMsg(successMsg, "A Product added successfully !!");
    }
  });
}

async function notFoundRoute(route) {
  const html = await fetch(route.template).then(response => response.text());

  // set the content of the content div to the html
  document.getElementById("root").innerHTML = html;
}
