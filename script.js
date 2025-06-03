/*variaveis*/
var login_cadastro = document.querySelector("#login_cadastro");
var login_cadastro_area = document.querySelector(".login_cadastro-area");
var hideTimeout = null;

let lastScroll = 0;
const header = document.querySelector("header");

var produtosV = document.querySelectorAll(".produtos");

/*funções*/
function alterarEstiloLoginCadastroArea(hover) {
  if (!login_cadastro_area) return;
  if (hover) {
    login_cadastro_area.style.display = "flex";
  } else {
    login_cadastro_area.style.display = "none";
  }
}

function manterAreaVisivel() {
  clearTimeout(hideTimeout);
  alterarEstiloLoginCadastroArea(true);
}

function agendarEsconderArea() {
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(function () {
    alterarEstiloLoginCadastroArea(false);
  }, 1000);
}

/*chamadas*/
if (login_cadastro && login_cadastro_area) {
  login_cadastro.addEventListener("mouseenter", manterAreaVisivel);
  login_cadastro.addEventListener("mouseleave", agendarEsconderArea);

  login_cadastro_area.addEventListener("mouseenter", manterAreaVisivel);
  login_cadastro_area.addEventListener("mouseleave", agendarEsconderArea);
}

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

document.addEventListener('DOMContentLoaded', function () {
  const produtosDiv = document.querySelector('.produtos');
  if (!produtosDiv) return;

  fetch('produtos.json')
    .then(response => response.json())
    .then(produtos => {
      produtosDiv.innerHTML = produtos.map(produto => `
        <div class="produto">
          <img src="${produto.imagem}" alt="${produto.nome}" class="produto-img">
          <div class="produto-info">
            <h3 class="produto-nome">${produto.nome}</h3>
            <p class="produto-preco">R$ ${produto.preco.toFixed(2)}</p>
          </div>
        </div>
      `).join('');
    })
    .catch(() => {
      produtosDiv.innerHTML = "<p>Não foi possível carregar os produtos.</p>";
    });
});