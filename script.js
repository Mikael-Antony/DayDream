//ambiente
let favoritos = JSON.parse(localStorage.getItem("favoritos") || "{}");
let carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");

/*variaveis*/
const login_cadastro = document.querySelector("#login_cadastro");
const login_cadastro_area = document.querySelector(".login_cadastro-area");
var carrinhoIcon = document.querySelector("#carrinho");
var carrinho_area = document.querySelector(".carrinho-area");
var hideTimeout = null;

let lastScroll = 0;
const header = document.querySelector("header");

const carrinhoQtd = document.getElementsByClassName("carrinho-qtd");
const carrinhoQtds = document.querySelectorAll(".carrinho-qtd");
// produtos
const produtosV = document.querySelectorAll(".produtos");
const produtosVDiv = document.querySelector(".produtosV");
const produtosH = document.querySelectorAll(".produtosH");
const produtosHDiv = document.querySelector(".produtosH");

// Variáveis globais para auto-scroll
let direction = 1; // 1 = direita, -1 = esquerda
let pause = false;
let userScrolling = false;
let scrollTimeout = null;
let hoverProdutoH = false;

//svg
var carrinhoSvg = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="1 2 20 20" style="vertical-align: middle">
  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14l.84-2h7.45c.75 0 1.41-.41 1.75-1.03l3.24-5.88A1 1 0 0 0 19.45 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.09z" style="fill: var(--cor-txt-header);" />
</svg>`,
];

const coracaoVazio = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" style="vertical-align: middle;cursor:pointer">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="var(--cor-coracao-nofav)"/>
</svg>`;

const coracaoCheio = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style="vertical-align: middle;cursor:pointer">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="var(--cor-coracao-fav)"/>
</svg>`;

// Controle de timeout individual para cada área
let hideTimeoutLogin = null;
let hideTimeoutCarrinho = null;

// Função genérica para mostrar/ocultar áreas e garantir exclusividade
function mostrarArea(area) {
  // Esconde todas as áreas antes de mostrar a desejada
  if (login_cadastro_area && area !== login_cadastro_area) login_cadastro_area.style.display = "none";
  if (carrinho_area && area !== carrinho_area) carrinho_area.style.display = "none";
  if (area) area.style.display = "flex";
}
function esconderArea(area) {
  if (area) area.style.display = "none";
}

// Login/Cadastro
if (login_cadastro && login_cadastro_area) {
  login_cadastro.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeoutLogin);
    mostrarArea(login_cadastro_area);
  });
  login_cadastro.addEventListener("mouseleave", () => {
    hideTimeoutLogin = setTimeout(() => esconderArea(login_cadastro_area), 700);
  });
  login_cadastro_area.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeoutLogin);
    mostrarArea(login_cadastro_area);
  });
  login_cadastro_area.addEventListener("mouseleave", () => {
    hideTimeoutLogin = setTimeout(() => esconderArea(login_cadastro_area), 700);
  });
}

// Carrinho
if (carrinhoIcon && carrinho_area) {
  carrinhoIcon.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeoutCarrinho);
    mostrarArea(carrinho_area);
  });
  carrinhoIcon.addEventListener("mouseleave", () => {
    hideTimeoutCarrinho = setTimeout(() => esconderArea(carrinho_area), 700);
  });
  carrinho_area.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeoutCarrinho);
    mostrarArea(carrinho_area);
  });
  carrinho_area.addEventListener("mouseleave", () => {
    hideTimeoutCarrinho = setTimeout(() => esconderArea(carrinho_area), 700);
  });
}

/*header*/
window.addEventListener("scroll", function () {
  const currentScroll = window.scrollY;

  if (currentScroll === 0) {
    header.classList.remove("header-escondido");
  } else if (currentScroll > lastScroll) {
    // Rolando para baixo
    header.classList.add("header-escondido");
  } else {
    // Rolando para cima
    header.classList.remove("header-escondido");
  }

  lastScroll = currentScroll;
});

// produtos verticais
document.addEventListener("DOMContentLoaded", function () {
  if (!produtosVDiv) return;
    // Atualize sempre que adicionar/remover itens do carrinho
  carrinhoQtd.textContent = carrinho.length;
  carrinhoQtds.forEach(el => el.textContent = carrinho.length);

  fetch("produtos.json")
    .then((response) => response.json())
    .then((produtos) => {
      produtosVDiv.innerHTML = produtos
        .map(
          (produto) => `
        <div class="produtoV">
          <div class="produtoV-div_img">
            <img src="${produto.imagem}" alt="${
            produto.nome
          }" class="produtoV-img">
          </div>
          <div class="produtoV-info">
            <div class="produtoV-nome-favorito">
              <h3 class="produtoV-nome">${produto.nome}</h3>
              <div class="produtoV-div-coracao">${favoritos[produto.id] ? coracaoCheio : coracaoVazio}</div>
            </div>
            <div class="produtoV-preco-add">
              <p class="produtoV-preco">R$ ${produto.preco.toFixed(2)}</p>
              <div class="add-produto-carrinho">
                ${carrinhoSvg[0]}+
              </div>
            </div>
          </div>
        </div>
      `
        )
        .join("");
      document
        .querySelectorAll(".produtoV-nome-favorito svg")
        .forEach((svg, idx) => {
          svg.addEventListener("click", function () {
            const produtoId = produtos[idx].id;
            favoritos[produtoId] = !favoritos[produtoId];
            localStorage.setItem("favoritos", JSON.stringify(favoritos));
            // Re-renderiza para atualizar o coração
            location.reload();
          });
        });
      // Após o bloco do coração
      document
        .querySelectorAll(".add-produto-carrinho")
        .forEach((div, idx) => {
          div.addEventListener("click", function () {
            const produto = produtos[idx];
            // Adiciona ao carrinho
            let carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
            carrinho.push(produto);
            localStorage.setItem("carrinho", JSON.stringify(carrinho));
            // Atualiza o contador do carrinho
            carrinhoQtd.textContent = carrinho.length;
            carrinhoQtds.forEach(el => el.textContent = carrinho.length);
          });
        });
    })
    .catch(() => {
      produtosVDiv.innerHTML = "<p>Não foi possível carregar os produtos.</p>";
    });
});

// produtos horizontais
function adicionarEventosProdutosH() {
  if (!produtosHDiv) return;
  const itens = produtosHDiv.querySelectorAll(".produtoH");
  itens.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      hoverProdutoH = true;
      pause = true;
    });
    item.addEventListener("mouseleave", () => {
      hoverProdutoH = false;
      pause = false;
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (!produtosHDiv) return;

  fetch("produtos.json")
    .then((response) => response.json())
    .then((produtos) => {
      produtosHDiv.innerHTML = produtos
        .map(
          (produto) => `
        <div class="produtoH">
          <img src="${produto.imagem}" alt="${
            produto.nome
          }" class="produtoH-img">
          <div class="produtoH-info">
            <h3 class="produtoH-nome">${produto.nome}</h3>
            <p class="produtoH-preco">R$ ${produto.preco.toFixed(2)}</p>
          </div>
        </div>
      `
        )
        .join("");
      adicionarEventosProdutosH();
    })
    .catch(() => {
      produtosHDiv.innerHTML = "<p>Não foi possível carregar os produtos.</p>";
    });

  // Auto-scroll horizontal
  function autoScroll() {
    if (pause) return;
    const item = produtosHDiv.querySelector(".produtoH");
    const itemWidth = item ? item.offsetWidth * 3 : 200; // ajuste o gap se necessário
    let nextScroll = produtosHDiv.scrollLeft + direction * itemWidth;

    // Limites
    if (nextScroll <= 0) {
      direction = 1;
      nextScroll = 0;
    } else if (
      nextScroll + produtosHDiv.offsetWidth >=
      produtosHDiv.scrollWidth - 5
    ) {
      direction = -1;
      nextScroll = produtosHDiv.scrollWidth - produtosHDiv.offsetWidth;
    }

    produtosHDiv.scrollTo({ left: nextScroll, behavior: "smooth" });
    pause = true;
    setTimeout(() => {
      // Só libera o pause se não estiver com hover em produto
      if (!hoverProdutoH) pause = false;
    }, 1500);
  }

  setInterval(autoScroll, 1200);

  // Pausa ao interagir com a barra de rolagem
  produtosHDiv.addEventListener("mousedown", () => {
    pause = true;
    userScrolling = true;
    if (scrollTimeout) clearTimeout(scrollTimeout);
  });

  produtosHDiv.addEventListener("scroll", () => {
    pause = true;
    userScrolling = true;
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Só libera o pause se não estiver com hover em produto
      if (!hoverProdutoH) {
        pause = false;
        userScrolling = false;
      }
    }, 2500);
  });

  produtosHDiv.addEventListener("mouseup", () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (!hoverProdutoH) {
        pause = false;
        userScrolling = false;
      }
    }, 2500);
  });
});


