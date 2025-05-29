// Remova o array de produtos deste arquivo!
// As informações dos produtos virão do produtos.js

let carrinho = [];

function renderizarProdutos(
  filtro = "",
  categoria = "",
  precoMin = "",
  precoMax = "",
  ordem = "padrao"
) {
  const lista = document.getElementById("lista-produtos");
  lista.innerHTML = "";
  let min = precoMin !== "" ? parseFloat(precoMin) : 0;
  let max = precoMax !== "" ? parseFloat(precoMax) : Infinity;

  let produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(filtro.toLowerCase()) &&
      (categoria === "" || produto.categoria === categoria) &&
      produto.preco >= min &&
      produto.preco <= max
  );

  // Ordenação
  if (ordem === "preco-asc") {
    produtosFiltrados.sort((a, b) => a.preco - b.preco);
  } else if (ordem === "preco-desc") {
    produtosFiltrados.sort((a, b) => b.preco - a.preco);
  }

  produtosFiltrados.forEach((produto) => {
    const div = document.createElement("div");
    div.className = "produto";
    div.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco.toFixed(2)}</p>
      <span class="categoria-produto">${produto.categoria}</span>
      <button onclick="adicionarAoCarrinho(${
        produto.id
      })">Adicionar ao Carrinho</button>
    `;
    lista.appendChild(div);
  });

  // Mensagem caso nenhum produto seja encontrado
  if (lista.innerHTML === "") {
    lista.innerHTML =
      '<p style="grid-column: 1/-1; text-align:center; color:#888; font-size:1.1rem;">Nenhum produto encontrado com os filtros selecionados.</p>';
  }
}

// Adiciona produto ao carrinho agrupando por id e quantidade
function adicionarAoCarrinho(id) {
  const produto = produtos.find((p) => p.id === id);
  if (produto) {
    const itemExistente = carrinho.find((item) => item.id === id);
    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      carrinho.push({ ...produto, quantidade: 1 });
    }
    atualizarCarrinho();
    if (document.getElementById("aba-carrinho")) {
      atualizarCarrinhoAba();
    }
  }
}

// Atualiza o contador do carrinho e a aba lateral
function atualizarCarrinho() {
  const carrinhoQtd = document.getElementById("carrinho-qtd");
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  if (carrinhoQtd) {
    carrinhoQtd.textContent = totalItens;
  }
  if (document.getElementById("aba-carrinho")) {
    atualizarCarrinhoAba();
  }
}

// Atualiza a lista de produtos e total na aba do carrinho, com quantidade e botões
function atualizarCarrinhoAba() {
  const ul = document.getElementById("itens-carrinho-aba");
  const totalSpan = document.getElementById("total-aba");
  if (!ul || !totalSpan) return;
  ul.innerHTML = "";
  let total = 0;
  carrinho.forEach((item, idx) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.marginBottom = "8px";

    li.innerHTML = `
      <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
      <div style="display:flex;align-items:center;gap:4px;">
        <button class="diminuir-quantidade" data-idx="${idx}" style="background:#eee;color:#222;border:none;border-radius:6px;padding:2px 10px;cursor:pointer;font-size:1.1rem;">-</button>
        <span style="min-width:24px;text-align:center;">${
          item.quantidade
        }</span>
        <button class="aumentar-quantidade" data-idx="${idx}" style="background:#eee;color:#222;border:none;border-radius:6px;padding:2px 10px;cursor:pointer;font-size:1.1rem;">+</button>
        <button class="remover-item-carrinho" data-idx="${idx}" style="background:#e74c3c;color:#fff;border:none;border-radius:6px;padding:2px 10px;cursor:pointer;font-size:1rem;margin-left:10px;">&times;</button>
      </div>
    `;
    ul.appendChild(li);
    total += item.preco * item.quantidade;
  });
  totalSpan.textContent = total.toFixed(2);

  // Eventos para aumentar, diminuir e remover
  document.querySelectorAll(".aumentar-quantidade").forEach((btn) => {
    btn.onclick = function () {
      const idx = parseInt(this.getAttribute("data-idx"));
      carrinho[idx].quantidade += 1;
      atualizarCarrinho();
    };
  });
  document.querySelectorAll(".diminuir-quantidade").forEach((btn) => {
    btn.onclick = function () {
      const idx = parseInt(this.getAttribute("data-idx"));
      if (carrinho[idx].quantidade > 1) {
        carrinho[idx].quantidade -= 1;
      } else {
        carrinho.splice(idx, 1);
      }
      atualizarCarrinho();
    };
  });
  document.querySelectorAll(".remover-item-carrinho").forEach((btn) => {
    btn.onclick = function () {
      const idx = parseInt(this.getAttribute("data-idx"));
      carrinho.splice(idx, 1);
      atualizarCarrinho();
    };
  });
}

// Finaliza a compra e limpa o carrinho
function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  alert("Compra finalizada com sucesso!");
  carrinho = [];
  atualizarCarrinho();
}

// Cria a aba lateral do carrinho (off-canvas)
function criarAbaCarrinho() {
  if (document.getElementById("aba-carrinho")) return; // Evita duplicar

  const aba = document.createElement("div");
  aba.id = "aba-carrinho";
  aba.style.position = "fixed";
  aba.style.top = "0";
  aba.style.right = "-400px";
  aba.style.width = "350px";
  aba.style.height = "100vh";
  aba.style.background = "#fff";
  aba.style.boxShadow = "-2px 0 16px rgba(0,0,0,0.12)";
  aba.style.zIndex = "9999";
  aba.style.transition = "right 0.3s";
  aba.style.padding = "32px 18px 18px 18px";
  aba.style.display = "flex";
  aba.style.flexDirection = "column";

  aba.innerHTML = `
    <button id="fechar-aba-carrinho" style="align-self:flex-end;font-size:1.5rem;background:none;border:none;cursor:pointer;">&times;</button>
    <h2 style="margin-top:0;">Seu Carrinho</h2>
    <ul id="itens-carrinho-aba" style="list-style:none;padding:0;margin:0 0 10px 0;"></ul>
    <p>Total: R$ <span id="total-aba">0.00</span></p>
    <button id="finalizar-compra-aba" style="background:#43e97b;color:#fff;border:none;border-radius:8px;padding:8px 18px;cursor:pointer;font-weight:500;">Finalizar Compra</button>
  `;
  document.body.appendChild(aba);

  // Evento para fechar a aba
  document.getElementById("fechar-aba-carrinho").onclick = fecharAbaCarrinho;
  document.getElementById("finalizar-compra-aba").onclick = function () {
    finalizarCompra();
    fecharAbaCarrinho();
  };
}

// Função para abrir a aba do carrinho
function abrirAbaCarrinho() {
  criarAbaCarrinho();
  atualizarCarrinhoAba();
  setTimeout(() => {
    document.getElementById("aba-carrinho").style.right = "0";
  }, 10);
}

// Função para fechar a aba do carrinho
function fecharAbaCarrinho() {
  const aba = document.getElementById("aba-carrinho");
  if (aba) {
    aba.style.right = "-400px";
    setTimeout(() => {
      if (aba) aba.remove();
    }, 300);
  }
}

// Atualiza a lista de produtos e total na aba do carrinho
function atualizarCarrinhoAba() {
  const ul = document.getElementById("itens-carrinho-aba");
  const totalSpan = document.getElementById("total-aba");
  if (!ul || !totalSpan) return;
  ul.innerHTML = "";
  let total = 0;
  carrinho.forEach((item, idx) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.marginBottom = "8px";

    li.innerHTML = `
      <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
      <div style="display:flex;align-items:center;gap:4px;">
        <button class="diminuir-quantidade" data-idx="${idx}" style="background:#eee;color:#222;border:none;border-radius:6px;padding:2px 10px;cursor:pointer;font-size:1.1rem;">-</button>
        <span style="min-width:24px;text-align:center;">${
          item.quantidade
        }</span>
        <button class="aumentar-quantidade" data-idx="${idx}" style="background:#eee;color:#222;border:none;border-radius:6px;padding:2px 10px;cursor:pointer;font-size:1.1rem;">+</button>
        <button class="remover-item-carrinho" data-idx="${idx}" style="background:#e74c3c;color:#fff;border:none;border-radius:6px;padding:2px 10px;cursor:pointer;font-size:1rem;margin-left:10px;">&times;</button>
      </div>
    `;
    ul.appendChild(li);
    total += item.preco * item.quantidade;
  });
  totalSpan.textContent = total.toFixed(2);

  // Eventos para aumentar, diminuir e remover
  document.querySelectorAll(".aumentar-quantidade").forEach((btn) => {
    btn.onclick = function () {
      const idx = parseInt(this.getAttribute("data-idx"));
      carrinho[idx].quantidade += 1;
      atualizarCarrinho();
    };
  });
  document.querySelectorAll(".diminuir-quantidade").forEach((btn) => {
    btn.onclick = function () {
      const idx = parseInt(this.getAttribute("data-idx"));
      if (carrinho[idx].quantidade > 1) {
        carrinho[idx].quantidade -= 1;
      } else {
        carrinho.splice(idx, 1);
      }
      atualizarCarrinho();
    };
  });
  document.querySelectorAll(".remover-item-carrinho").forEach((btn) => {
    btn.onclick = function () {
      const idx = parseInt(this.getAttribute("data-idx"));
      carrinho.splice(idx, 1);
      atualizarCarrinho();
    };
  });
}

// Adiciona evento ao botão do header para abrir a aba do carrinho
document.addEventListener("DOMContentLoaded", function () {
  const carrinhoContador = document.getElementById("carrinho-contador");
  if (carrinhoContador) {
    carrinhoContador.style.cursor = "pointer";
    carrinhoContador.onclick = abrirAbaCarrinho;
  }
});

//area de rolagem vertical
function renderizarProdutosDestaque(categoriaSelecionada = "") {
  const destaqueDiv = document.getElementById("produtos-destaque");
  if (!destaqueDiv) return;

  // Filtra produtos pela categoria selecionada (ou todos se nenhuma)
  let relacionados = produtos.filter(p =>
    !categoriaSelecionada || p.categoria === categoriaSelecionada
  );

  // Embaralha e limita a 16 itens
  relacionados = relacionados.sort(() => Math.random() - 0.5).slice(0, 16);

  if (relacionados.length === 0) {
    destaqueDiv.innerHTML = `<p style="text-align:center;color:#888;">Nenhum produto relacionado encontrado.</p>`;
    return;
  }

  destaqueDiv.innerHTML = relacionados.map(produto => `
    <div class="produto-destaque destaque-grande">
      <div class="imagem-produto-destaque">
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="info-sobreposta">
          <span class="nome-produto">${produto.nome}</span>
          <span class="preco-produto">R$ ${produto.preco.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `).join("");
}

// Evento para filtro de categoria por botões e pesquisa
document.addEventListener("DOMContentLoaded", function () {
  const barra = document.getElementById("barra-pesquisa");
  const botoesCategoria = document.querySelectorAll(".btn-categoria");
  const filtroCategoria = document.getElementById("filtro-categoria");
  const filtroPrecoMin = document.getElementById("filtro-preco-min");
  const filtroPrecoMax = document.getElementById("filtro-preco-max");
  const btnLimpar = document.getElementById("limpar-filtros");
  const filtroOrdem = document.getElementById("filtro-ordem");

  let categoriaSelecionada = "";
  let ordemSelecionada = "padrao";

  function filtrar() {
    renderizarProdutos(
      barra ? barra.value : "",
      categoriaSelecionada || (filtroCategoria ? filtroCategoria.value : ""),
      filtroPrecoMin ? filtroPrecoMin.value : "",
      filtroPrecoMax ? filtroPrecoMax.value : "",
      ordemSelecionada
    );
  }

  // Busca por texto
  if (barra) barra.addEventListener("input", filtrar);

  // Botões de categoria
  botoesCategoria.forEach((btn) => {
    btn.addEventListener("click", function () {
      botoesCategoria.forEach((b) => b.classList.remove("ativa"));
      this.classList.add("ativa");
      categoriaSelecionada = this.getAttribute("data-categoria");
      if (filtroCategoria) filtroCategoria.value = categoriaSelecionada;
      filtrar();
      renderizarProdutosDestaque(categoriaSelecionada);

      // Scroll para o início da área de produtos considerando o header
      const lista = document.getElementById("lista-produtos");
      const header = document.querySelector("header");
      if (lista) {
        const headerHeight = header ? header.offsetHeight : 0;
        const top = lista.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  // Select de categoria
  if (filtroCategoria) {
    filtroCategoria.addEventListener("change", function () {
      categoriaSelecionada = this.value;
      botoesCategoria.forEach((btn) => {
        if (btn.getAttribute("data-categoria") === categoriaSelecionada) {
          btn.classList.add("ativa");
        } else {
          btn.classList.remove("ativa");
        }
      });
      filtrar();
      renderizarProdutosDestaque(categoriaSelecionada);

      // Scroll para o início da área de produtos considerando o header
      const lista = document.getElementById("lista-produtos");
      const header = document.querySelector("header");
      if (lista) {
        const headerHeight = header ? header.offsetHeight : 0;
        const top = lista.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  }

  // Filtros de preço
  if (filtroPrecoMin) filtroPrecoMin.addEventListener("input", filtrar);
  if (filtroPrecoMax) filtroPrecoMax.addEventListener("input", filtrar);

  // Filtro de ordem
  if (filtroOrdem) {
    filtroOrdem.addEventListener("change", function () {
      ordemSelecionada = this.value;
      filtrar();
    });
  }

  // Limpar filtros
  if (btnLimpar) {
    btnLimpar.addEventListener("click", function () {
      if (filtroCategoria) filtroCategoria.value = "";
      if (filtroPrecoMin) filtroPrecoMin.value = "";
      if (filtroPrecoMax) filtroPrecoMax.value = "";
      if (barra) barra.value = "";
      if (filtroOrdem) filtroOrdem.value = "padrao";
      categoriaSelecionada = "";
      ordemSelecionada = "padrao";
      botoesCategoria.forEach((b) => b.classList.remove("ativa"));
      if (botoesCategoria.length) botoesCategoria[0].classList.add("ativa"); // Marca "Todas"
      filtrar();
    });
  }

  renderizarProdutos();
});

// Inicializa a lista de produtos ao carregar a página
window.onload = function () {
  renderizarProdutos();
  atualizarCarrinho();
  renderizarProdutosDestaque(""); // Mostra todos inicialmente
};

// Oculta categorias ao rolar para baixo e mostra ao voltar ao topo
document.addEventListener("DOMContentLoaded", function () {
  const categoriasHeader = document.getElementById("categorias-header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 20) {
      categoriasHeader.classList.add("oculto");
    } else {
      categoriasHeader.classList.remove("oculto");
    }
  });
});

let ultimoScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", function () {
  if (window.innerWidth <= 991) {
    // só em telas menores
    const atualScroll = window.scrollY;
    if (atualScroll > ultimoScroll && atualScroll > 100) {
      header.classList.add("header-oculto");
    } else {
      header.classList.remove("header-oculto");
    }
    ultimoScroll = atualScroll;
  } else {
    header.classList.remove("header-oculto");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const btnToggleFiltros = document.getElementById("btn-toggle-filtros");
  const filtros = document.querySelector(".filtros-produtos");

  if (btnToggleFiltros && filtros) {
    btnToggleFiltros.addEventListener("click", function () {
      filtros.classList.toggle("aberta");
      // Altera o texto do botão conforme o estado
      if (filtros.classList.contains("aberta")) {
        btnToggleFiltros.textContent = "Ocultar Filtros";
      } else {
        btnToggleFiltros.textContent = "Filtros";
      }
    });
  }
});

// Atualiza o contador do carrinho no header
function atualizarContadorCarrinho() {
  const carrinhoQtd = document.getElementById("carrinho-qtd");
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  if (carrinhoQtd) {
    carrinhoQtd.textContent = totalItens;
  }
}

// Chama a função de atualizar contador sempre que o carrinho é atualizado
const originalAtualizarCarrinho = atualizarCarrinho;
atualizarCarrinho = function () {
  originalAtualizarCarrinho();
  atualizarContadorCarrinho();
};

const originalAtualizarCarrinhoAba = atualizarCarrinhoAba;
atualizarCarrinhoAba = function () {
  originalAtualizarCarrinhoAba();
  atualizarContadorCarrinho();
};

document.addEventListener("DOMContentLoaded", function () {
  const btnToggleCategorias = document.getElementById("btn-toggle-categorias");
  const filtros = document.querySelector(".filtros-produtos");
  if (!btnToggleCategorias || !filtros) return;

  function atualizarVisibilidadeBotao() {
    // Posição do final da área de filtros + margem extra (ex: 40px)
    const filtrosBottom = filtros.getBoundingClientRect().bottom;
    const margem = 40; // ajuste conforme desejar
    if (filtrosBottom <= margem) {
      btnToggleCategorias.classList.add("visivel");
    } else {
      btnToggleCategorias.classList.remove("visivel");
    }
  }

  window.addEventListener("scroll", atualizarVisibilidadeBotao);
  window.addEventListener("resize", atualizarVisibilidadeBotao);
  atualizarVisibilidadeBotao();
});

document.addEventListener("DOMContentLoaded", function () {
  const destaqueDiv = document.getElementById("produtos-destaque");
  if (!destaqueDiv) return;

  let direction = 1; // 1 = direita, -1 = esquerda
  let interval = null;
  let pause = false;
  let userScrolling = false;
  let scrollTimeout = null;

  function autoScroll() {
    if (pause) return;
    const item = destaqueDiv.querySelector('.produto-destaque');
    const itemWidth = item ? item.offsetWidth + 24 : 200; // 24 = gap
    let nextScroll = destaqueDiv.scrollLeft + direction * itemWidth;

    // Limites
    if (nextScroll <= 0) {
      direction = 1;
      nextScroll = 0;
    } else if (nextScroll + destaqueDiv.offsetWidth >= destaqueDiv.scrollWidth - 5) {
      direction = -1;
      nextScroll = destaqueDiv.scrollWidth - destaqueDiv.offsetWidth;
    }

    destaqueDiv.scrollTo({ left: nextScroll, behavior: "smooth" });
    pause = true;
    setTimeout(() => { pause = false; }, 1250);
  }

  interval = setInterval(autoScroll, 1000);

  // Pausa ao passar o mouse
  destaqueDiv.addEventListener('mouseenter', () => { pause = true; });
  destaqueDiv.addEventListener('mouseleave', () => { pause = false; });

  // Pausa ao scrollar manualmente e por 2s após soltar
  destaqueDiv.addEventListener('scroll', () => {
    pause = true;
    userScrolling = true;
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      pause = false;
      userScrolling = false;
    }, 2000); // 2 segundos após parar de scrollar
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Botão de categorias
  const btnToggleCategorias = document.getElementById("btn-toggle-categorias");
  const filtros = document.querySelector(".filtros-produtos");
  if (btnToggleCategorias && filtros) {
    function atualizarVisibilidadeBotao() {
      const filtrosBottom = filtros.getBoundingClientRect().bottom;
      const margem = 40;
      if (filtrosBottom <= margem) {
        btnToggleCategorias.classList.add("visivel");
      } else {
        btnToggleCategorias.classList.remove("visivel");
      }
    }
    window.addEventListener("scroll", atualizarVisibilidadeBotao);
    window.addEventListener("resize", atualizarVisibilidadeBotao);
    atualizarVisibilidadeBotao();
  }

  // Garanta que o clique funciona sempre
  if (btnToggleCategorias) {
    btnToggleCategorias.addEventListener("click", function () {
      // Sua lógica para expandir/ocultar categorias
      const categoriasHeader = document.getElementById("categorias-header");
      if (categoriasHeader) {
        categoriasHeader.classList.toggle("oculto");
      }
    });
  }
});
