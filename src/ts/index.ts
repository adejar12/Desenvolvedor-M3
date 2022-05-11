import IBlouse from "./interfaces/blouses";
import { getAllBlouses } from "./services/blouses";

var blouses: IBlouse[];
var filtersColors = new Array<String>();
var filtersSizes = new Array<String>();
var filtersPrices = new Array<String>();
var orderFilters = "";
var maxFilter = 8;
var maxColors = 4;
var blousesFiltered = new Array<IBlouse>();

document.addEventListener("DOMContentLoaded", async function () {
  blouses = await getAllBlouses();
  blousesFiltered = blouses;
  renderColors(blousesFiltered);
  renderSizes(blousesFiltered);
  renderItems(blousesFiltered);
});

function extractProperty(blouses: IBlouse[], property: string): Array<IBlouse> {
  if (property !== "size") {
    return blouses
      .sort(function (a, b) {
        if (a[property] < b[property]) {
          return -1;
        }

        if (a[property] > b[property]) {
          return 1;
        }

        return 0;
      })
      .filter(function (item, pos, ary) {
        return !pos || item[property] != ary[pos - 1][property];
      });
  } else {
    var sizes = [];
    blouses.map((blouse) => {
      blouse.size.map((size) => {
        sizes.push(size);
      });
    });
    return sizes
      .sort(function (a, b) {
        if (a > b) {
          return -1;
        }

        if (a < b) {
          return 1;
        }

        return 0;
      })
      .filter(function (item, pos, ary) {
        return !pos || item != ary[pos - 1];
      });
  }
}

function renderColors(blouses: IBlouse[]) {
  const filteredBlouses = extractProperty(blouses, "color");
  const contentColors = document.querySelector("div.content-colors");
  const contentColorsMobile = document.querySelector(
    "div.content-colors-mobile"
  );

  while (contentColors.firstChild) {
    contentColors.removeChild(contentColors.firstChild);
  }

  while (contentColorsMobile.firstChild) {
    contentColorsMobile.removeChild(contentColorsMobile.firstChild);
  }

  filteredBlouses.map((blouse, index) => {
    if (index > maxColors) {
      return;
    }

    var contentSquare = document.createElement("div");
    contentSquare.className = "content-square";

    var square = document.createElement("div");
    square.className = "square";
    square.onclick = () => {
      checkEnabled(square, "color", blouse.color);
    };

    var squareTitle = document.createElement("span");
    squareTitle.className = "square-title";
    squareTitle.innerHTML = blouse.color;

    contentSquare.appendChild(square);
    contentSquare.appendChild(squareTitle);

    contentColors.appendChild(contentSquare);
  });

  filteredBlouses.map((blouse, index) => {
    if (index > maxColors) {
      return;
    }

    var contentSquare = document.createElement("div");
    contentSquare.className = "content-square";

    var square = document.createElement("div");
    square.className = "square";
    square.onclick = () => {
      checkEnabled(square, "color", blouse.color);
    };

    var squareTitle = document.createElement("span");
    squareTitle.className = "square-title";
    squareTitle.innerHTML = blouse.color;

    contentSquare.appendChild(square);
    contentSquare.appendChild(squareTitle);

    contentColorsMobile.appendChild(contentSquare);
  });
}

function renderSizes(blouses: IBlouse[]) {
  const filteredSizes = extractProperty(blouses, "size");
  const contentSizes = document.querySelector("div.content-sizes");
  const contentSizesMobile = document.querySelector("div.content-sizes-mobile");

  while (contentSizes.firstChild) {
    contentSizes.removeChild(contentSizes.firstChild);
  }

  while (contentSizesMobile.firstChild) {
    contentSizesMobile.removeChild(contentSizesMobile.firstChild);
  }

  filteredSizes.map((blouse) => {
    var squareSizes = document.createElement("div");
    squareSizes.className = "square-sizes";
    squareSizes.onclick = () => {
      checkEnabled(squareSizes, "size", blouse.toString());
    };

    var sizesTitle = document.createElement("span");
    sizesTitle.className = "sizes-title";
    sizesTitle.innerHTML = blouse.toString();

    squareSizes.appendChild(sizesTitle);

    contentSizes.appendChild(squareSizes);
  });

  filteredSizes.map((blouse) => {
    var squareSizes = document.createElement("div");
    squareSizes.className = "square-sizes";
    squareSizes.onclick = () => {
      checkEnabled(squareSizes, "size", blouse.toString());
    };

    var sizesTitle = document.createElement("span");
    sizesTitle.className = "sizes-title";
    sizesTitle.innerHTML = blouse.toString();

    squareSizes.appendChild(sizesTitle);

    contentSizesMobile.appendChild(squareSizes);
  });
}

function renderItems(blouses: IBlouse[]) {
  const btnLoadMore = document.querySelector("div.load-more");
  const contentItems = document.querySelector("div.content-items");

  while (contentItems.firstChild) {
    contentItems.removeChild(contentItems.firstChild);
  }

  if (blouses.length === 0) {
    btnLoadMore.classList.add("hidden");
    return;
  }

  blouses.map((blouse, index) => {
    if (index > maxFilter) {
      btnLoadMore.classList.remove("hidden");
      return;
    } else {
      btnLoadMore.classList.add("hidden");
    }
    var contentItem = document.createElement("div");
    contentItem.className = "content-item";

    var image = document.createElement("img");
    image.src = blouse.image;
    image.alt = blouse.name;
    image.className = "item-image";

    var nameProduct = document.createElement("span");
    nameProduct.className = "name-product";
    nameProduct.innerHTML = blouse.name;

    var price = document.createElement("span");
    price.className = "price";
    price.innerHTML = `R$ ${addZero(convertPointToComma(blouse.price))}`;

    var inUpTo = document.createElement("span");
    inUpTo.className = "in-up-to";
    inUpTo.innerHTML = `até ${blouse.parcelamento[0]}x de R$:${addZero(
      convertPointToComma(blouse.parcelamento[1])
    )}`;

    var buttonBuy = document.createElement("div");
    buttonBuy.className = "button-buy";
    buttonBuy.onclick = () => {
      purchased();
    };

    var buttonBuyText = document.createElement("span");
    buttonBuyText.innerHTML = "COMPRAR";

    buttonBuy.appendChild(buttonBuyText);

    contentItem.append(image, nameProduct, price, inUpTo, buttonBuy);

    contentItems.appendChild(contentItem);
  });
}

function purchased() {
  const qtd_purchased = document.querySelector("div.number");
  const circle: HTMLElement = document.querySelector("div.circle");

  if (qtd_purchased.textContent == " ") {
    circle.classList.remove("hidden");
    qtd_purchased.innerHTML = "1";
  } else {
    const qtd = parseInt(qtd_purchased.textContent) + 1;

    qtd_purchased.innerHTML = qtd.toString();

    if (qtd > 9) {
      qtd_purchased.innerHTML = "9+";
      circle.style.justifyContent = "flex-start";
    }
  }
}

function convertPointToComma(value: number): string {
  return value.toString().replace(".", ",");
}

function addZero(value: string): string {
  const values = value.split(",");
  if (!values[1]) {
    return `${value},00`;
  } else {
    const valueInt = parseInt(values[1]);
    if (valueInt < 10) {
      return `${values[0]},${values[1]}0`;
    }
  }

  return value;
}

function filterItems(): void {
  blousesFiltered = blouses;

  orderBy(orderFilters);

  if (filtersSizes.length > 0) {
    filterSizes();
  }

  if (filtersPrices.length > 0) {
    filterPrices();
  }

  if (filtersColors.length > 0) {
    filterColors();
  }

  renderItems(blousesFiltered);
}

function filterColors(): void {
  const colors = blouses.filter((blouse) => {
    if (
      filtersColors.filter((color) => {
        if (blouse.color === color) {
          return color;
        }
      }).length > 0
    ) {
      return blouse;
    }
  });

  blousesFiltered = blousesFiltered.filter((blouse) => {
    if (
      colors.filter((color) => {
        if (blouse.color === color.color) {
          return color;
        }
      }).length > 0
    ) {
      return blouse;
    }
  });
}

function filterSizes(): void {
  const sizes = blouses.filter((blouse) => {
    if (
      filtersSizes.filter((size) => {
        if (
          blouse.size.filter((blouseSize) => {
            if (blouseSize === size) {
              return blouseSize;
            }
          }).length > 0
        ) {
          return size;
        }
      }).length > 0
    ) {
      return blouse;
    }
  });

  blousesFiltered = blousesFiltered.filter((blouse) => {
    if (
      blouse.size.filter((blouseSize) => {
        if (
          sizes.filter((size) => {
            if (
              size.size.filter((sizeSize) => {
                if (sizeSize === blouseSize) {
                  return sizeSize;
                }
              }).length > 0
            ) {
              return size;
            }
          }).length > 0
        ) {
          return blouseSize;
        }
      }).length > 0
    ) {
      return blouse;
    }
  });
}

function filterPrices(): void {
  const prices = blouses.filter((blouse) => {
    if (
      filtersPrices.filter((oneValue) => {
        const value = oneValue.split("<");
        if (parseInt(value[0]) === 0) {
          return blouse.price <= parseInt(value[1]);
        }
        if (parseInt(value[1]) === 0) {
          return blouse.price >= parseInt(value[0]);
        }
        if (
          blouse.price > parseInt(value[0]) &&
          blouse.price < parseInt(value[1])
        ) {
          return oneValue;
        }
      }).length > 0
    ) {
      return blouse;
    }
  });

  blousesFiltered = blousesFiltered.filter((blouse) => {
    if (
      prices.filter((blousePrice) => {
        if (blouse.price === blousePrice.price) {
          return blousePrice;
        }
      }).length > 0
    ) {
      return blouse;
    }
  });
}

export function orderBy(select: string): void {
  orderFilters = select;
  if (select === "mais_recente") {
    renderItems(
      blousesFiltered.sort((a, b) => {
        if (new Date(a.date) < new Date(b.date)) {
          return -1;
        }
        if (new Date(a.date) > new Date(b.date)) {
          return 1;
        }

        return 0;
      })
    );
  } else if (select === "maior_preco" || select === "menor_preco") {
    renderItems(
      blousesFiltered.sort((a, b) => {
        if (a.price > b.price) {
          if (select === "maior_preco") {
            return -1;
          } else {
            return 1;
          }
        }
        if (a.price < b.price) {
          if (select === "maior_preco") {
            return 1;
          } else {
            return -1;
          }
        }

        return 0;
      })
    );
  } else {
    renderItems(blousesFiltered);
  }
}

export function checkEnabled(
  div: HTMLElement,
  typeFilter: string,
  filter: string
): void {
  //Experimente usar o toggle, ta no minuto 1:00:40
  if (div.classList.value.indexOf("checked") === -1) {
    div.classList.add("checked");
    if (typeFilter === "size") {
      filtersSizes.push(filter);
    } else if (typeFilter === "color") {
      filtersColors.push(filter);
    } else {
      filtersPrices.push(filter);
    }
  } else {
    div.classList.remove("checked");
    if (typeFilter === "size") {
      filtersSizes.splice(filtersSizes.indexOf(filter), 1);
    } else if (typeFilter === "color") {
      filtersColors = filtersColors.filter((item) => {
        return item !== filter;
      });
    } else {
      filtersPrices = filtersPrices.filter((item) => {
        return item !== filter;
      });
    }
  }

  filterItems();
}

export function increaseFilter(): void {
  maxFilter += 8;
  renderItems(blouses);
}

export function renderMoreColors(value: HTMLElement): void {
  const contentSizes = document.querySelector("p.more-colors-title");

  let contentItem = document.createElement("i");

  if (value.textContent.indexOf("todas") !== -1) {
    contentSizes.innerHTML = "Ver menos";

    contentItem.className = "arrow up";
    contentItem.style.marginLeft = "40px";
    contentItem.style.marginBottom = "-2px";

    contentSizes.appendChild(contentItem);
    maxColors = 8;
  } else {
    contentSizes.innerHTML = "Ver todas as cores ";

    contentItem.className = "arrow down";
    contentItem.style.marginLeft = "3px";
    contentItem.style.marginBottom = "2px";

    contentSizes.appendChild(contentItem);
    maxColors = 4;
  }

  renderColors(blouses);
}

export function renderMoreColorsMobile(value: HTMLElement): void {
  const contentSizes = document.querySelector("p.more-colors-title-mobile");

  let contentItem = document.createElement("i");

  if (value.textContent.indexOf("todas") !== -1) {
    contentSizes.innerHTML = "Ver menos";

    contentItem.className = "arrow up";
    contentItem.style.marginLeft = "40px";
    contentItem.style.marginBottom = "-2px";

    contentSizes.appendChild(contentItem);
    maxColors = 8;
  } else {
    contentSizes.innerHTML = "Ver todas as cores ";

    contentItem.className = "arrow down";
    contentItem.style.marginLeft = "3px";
    contentItem.style.marginBottom = "2px";

    contentSizes.appendChild(contentItem);
    maxColors = 4;
  }

  renderColors(blouses);
}

export function showFilters(): void {
  const contentSizes = document.querySelector("div.content-order-by-mobile");
  document.querySelector("body").style.overflow = "hidden";
  contentSizes.classList.toggle("show");
}

export function showOrderBy(): void {
  const contentFilters = document.querySelector("div.content-filters-mobile");
  document.querySelector("body").style.overflow = "hidden";
  contentFilters.classList.toggle("show");
}

export function closeContentMobile(): void {
  const contentSizes = document.querySelector("div.content-order-by-mobile");
  const contentFilters = document.querySelector("div.content-filters-mobile");
  contentSizes.classList.remove("show");
  contentFilters.classList.remove("show");
  document.querySelector("body").style.overflow = "initial";
}

export function showOption(option: string, html: HTMLElement): void {
  const contentColor = document.querySelector(
    "div.content-option-showing-mobile-color"
  );
  const contentSize = document.querySelector(
    "div.content-option-showing-mobile-sizes"
  );
  const contentPrice = document.querySelector(
    "div.content-option-showing-mobile-prices"
  );

  html.lastElementChild.classList.toggle("up");

  if (option === "COLOR") {
    contentColor.classList.toggle("expose");
  } else if (option === "SIZES") {
    contentSize.classList.toggle("expose");
  } else {
    contentPrice.classList.toggle("expose");
  }
}
