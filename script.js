// Remova o array de produtos deste arquivo! 
// As informações dos produtos virão do produtos.js

let carrinho = [];

function renderizarProdutos(filtro = "", categoria = "", precoMin = "", precoMax = "") {
  const lista = document.getElementById('lista-produtos');
  lista.innerHTML = '';
  let min = precoMin !== "" ? parseFloat(precoMin) : 0;
  let max = precoMax !== "" ? parseFloat(precoMax) : Infinity;

  produtos
    .filter(produto =>
      produto.nome.toLowerCase().includes(filtro.toLowerCase()) &&
      (categoria === "" || produto.categoria === categoria) &&
      produto.preco >= min &&
      produto.preco <= max
    )
    .forEach(produto => {
      const div = document.createElement('div');
      div.className = 'produto';
      div.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <h3>${produto.nome}</h3>
        <p>R$ ${produto.preco.toFixed(2)}</p>
        <span class="categoria-produto">${produto.categoria}</span>
        <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
      `;
      lista.appendChild(div);
    });

  // Mensagem caso nenhum produto seja encontrado
  if (lista.innerHTML === '') {
    lista.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#888; font-size:1.1rem;">Nenhum produto encontrado com os filtros selecionados.</p>';
  }
}

// Adiciona produto ao carrinho agrupando por id e quantidade
function adicionarAoCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  if (produto) {
    const itemExistente = carrinho.find(item => item.id === id);
    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      carrinho.push({ ...produto, quantidade: 1 });
    }
    atualizarCarrinho();
    if (document.getElementById('aba-carrinho')) {
      atualizarCarrinhoAba();
    }
  }
}

// Atualiza o contador do carrinho e a aba lateral
function atualizarCarrinho() {
  const carrinhoContador = document.getElementById('carrinho-contador');
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  if (carrinhoContador) {
    carrinhoContador.textContent = `Carrinho (${totalItens})`;
  }
  if (document.getElementById('aba-carrinho')) {
    atualizarCarrinhoAba();
  }
}

// Atualiza a lista de produtos e total na aba do carrinho, com quantidade e botões
function atualizarCarrinhoAba() {
  const ul = document.getElementById('itens-carrinho-aba');
  const totalSpan = document.getElementById('total-aba');
  if (!ul || !totalSpan) return;
  ul.innerHTML = '';
  let total = 0;
  carrinho.forEach((item, idx) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.marginBottom = '8px';

    li.innerHTML = `
      <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
      <div style="display:flex;align-items:center;gap:4px;">
        <button class="diminuir-quantidade" data-idx="${idx}" style="background:#eee;color:#222;border:none;border-radius:6px;padding:2px 10px;cursor:pointer;font-size:1.1rem;">-</button>
        <span style="min-width:24px;text-align:center;">${item.quantidade}</span>
        <button class="aumentar-quantidade" data-idx="${idx}" style="background:#eee;color:#222;border:none;border-radius:6px;padding:2px 10px;cursor:pointer;font-size:1.1rem;">+</button>
        <button class="remover-item-carrinho" data-idx="${idx}" style="background:#e74c3c;color:#fff;border:none;border-radius:6px;padding:2px 10px;cursor:pointer;font-size:1rem;margin-left:10px;">&times;</button>
      </div>
    `;
    ul.appendChild(li);
    total += item.preco * item.quantidade;
  });
  totalSpan.textContent = total.toFixed(2);

  // Eventos para aumentar, diminuir e remover
  document.querySelectorAll('.aumentar-quantidade').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      carrinho[idx].quantidade += 1;
      atualizarCarrinho();
    };
  });
  document.querySelectorAll('.diminuir-quantidade').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      if (carrinho[idx].quantidade > 1) {
        carrinho[idx].quantidade -= 1;
      } else {
        carrinho.splice(idx, 1);
      }
      atualizarCarrinho();
    };
  });
  document.querySelectorAll('.remover-item-carrinho').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      carrinho.splice(idx, 1);
      atualizarCarrinho();
    };
  });
}

// Finaliza a compra e limpa o carrinho
function finalizarCompra() {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  alert('Compra finalizada com sucesso!');
  carrinho = [];
  atualizarCarrinho();
}

// Cria a aba lateral do carrinho (off-canvas)
function criarAbaCarrinho() {
  if (document.getElementById('aba-carrinho')) return; // Evita duplicar

  const aba = document.createElement('div');
  aba.id = 'aba-carrinho';
  aba.style.position = 'fixed';
  aba.style.top = '0';
  aba.style.right = '-400px';
  aba.style.width = '350px';
  aba.style.height = '100vh';
  aba.style.background = '#fff';
  aba.style.boxShadow = '-2px 0 16px rgba(0,0,0,0.12)';
  aba.style.zIndex = '9999';
  aba.style.transition = 'right 0.3s';
  aba.style.padding = '32px 18px 18px 18px';
  aba.style.display = 'flex';
  aba.style.flexDirection = 'column';

  aba.innerHTML = `
    <button id="fechar-aba-carrinho" style="align-self:flex-end;font-size:1.5rem;background:none;border:none;cursor:pointer;">&times;</button>
    <h2 style="margin-top:0;">Seu Carrinho</h2>
    <ul id="itens-carrinho-aba" style="list-style:none;padding:0;margin:0 0 10px 0;"></ul>
    <p>Total: R$ <span id="total-aba">0.00</span></p>
    <button id="finalizar-compra-aba" style="background:#43e97b;color:#fff;border:none;border-radius:8px;padding:8px 18px;cursor:pointer;font-weight:500;">Finalizar Compra</button>
  `;
  document.body.appendChild(aba);

  // Evento para fechar a aba
  document.getElementById('fechar-aba-carrinho').onclick = fecharAbaCarrinho;
  document.getElementById('finalizar-compra-aba').onclick = function() {
    finalizarCompra();
    fecharAbaCarrinho();
  };
}

// Função para abrir a aba do carrinho
function abrirAbaCarrinho() {
  criarAbaCarrinho();
  atualizarCarrinhoAba();
  setTimeout(() => {
    document.getElementById('aba-carrinho').style.right = '0';
  }, 10);
}

// Função para fechar a aba do carrinho
function fecharAbaCarrinho() {
  const aba = document.getElementById('aba-carrinho');
  if (aba) {
    aba.style.right = '-400px';
    setTimeout(() => {
      if (aba) aba.remove();
    }, 300);
  }
}

// Atualiza a lista de produtos e total na aba do carrinho
function atualizarCarrinhoAba() {
  const ul = document.getElementById('itens-carrinho-aba');
  const totalSpan = document.getElementById('total-aba');
  if (!ul || !totalSpan) return;
  ul.innerHTML = '';
  let total = 0;
  carrinho.forEach((item, idx) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.marginBottom = '8px';

    li.innerHTML = `
      <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
      <div style="display:flex;align-items:center;gap:4px;">
        <button class="diminuir-quantidade" data-idx="${idx}" style="background:#eee;color:#222;border:none;border-radius:6px;padding:2px 10px;cursor:pointer;font-size:1.1rem;">-</button>
        <span style="min-width:24px;text-align:center;">${item.quantidade}</span>
        <button class="aumentar-quantidade" data-idx="${idx}" style="background:#eee;color:#222;border:none;border-radius:6px;padding:2px 10px;cursor:pointer;font-size:1.1rem;">+</button>
        <button class="remover-item-carrinho" data-idx="${idx}" style="background:#e74c3c;color:#fff;border:none;border-radius:6px;padding:2px 10px;cursor:pointer;font-size:1rem;margin-left:10px;">&times;</button>
      </div>
    `;
    ul.appendChild(li);
    total += item.preco * item.quantidade;
  });
  totalSpan.textContent = total.toFixed(2);

  // Eventos para aumentar, diminuir e remover
  document.querySelectorAll('.aumentar-quantidade').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      carrinho[idx].quantidade += 1;
      atualizarCarrinho();
    };
  });
  document.querySelectorAll('.diminuir-quantidade').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      if (carrinho[idx].quantidade > 1) {
        carrinho[idx].quantidade -= 1;
      } else {
        carrinho.splice(idx, 1);
      }
      atualizarCarrinho();
    };
  });
  document.querySelectorAll('.remover-item-carrinho').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      carrinho.splice(idx, 1);
      atualizarCarrinho();
    };
  });
}

// Adiciona evento ao botão do header para abrir a aba do carrinho
document.addEventListener('DOMContentLoaded', function() {
  const carrinhoContador = document.getElementById('carrinho-contador');
  if (carrinhoContador) {
    carrinhoContador.style.cursor = 'pointer';
    carrinhoContador.onclick = abrirAbaCarrinho;
  }
});

// Evento para filtro de categoria por botões e pesquisa
document.addEventListener('DOMContentLoaded', function() {
  const barra = document.getElementById('barra-pesquisa');
  const botoesCategoria = document.querySelectorAll('.btn-categoria');
  let categoriaSelecionada = "";

  function filtrar() {
    renderizarProdutos(barra.value, categoriaSelecionada);
  }

  if (barra) barra.addEventListener('input', filtrar);

  botoesCategoria.forEach(btn => {
    btn.addEventListener('click', function() {
      botoesCategoria.forEach(b => b.classList.remove('ativa'));
      this.classList.add('ativa');
      categoriaSelecionada = this.getAttribute('data-categoria');
      filtrar();
    });
  });

  renderizarProdutos();
});

// Filtros: categoria (select), valor (inputs) e busca (input)
document.addEventListener('DOMContentLoaded', function() {
  const barra = document.getElementById('barra-pesquisa');
  const filtroCategoria = document.getElementById('filtro-categoria');
  const filtroPrecoMin = document.getElementById('filtro-preco-min');
  const filtroPrecoMax = document.getElementById('filtro-preco-max');
  const btnLimpar = document.getElementById('limpar-filtros');

  function filtrar() {
    renderizarProdutos(
      barra.value,
      filtroCategoria.value,
      filtroPrecoMin.value,
      filtroPrecoMax.value
    );
  }

  if (barra) barra.addEventListener('input', filtrar);
  if (filtroCategoria) filtroCategoria.addEventListener('change', filtrar);
  if (filtroPrecoMin) filtroPrecoMin.addEventListener('input', filtrar);
  if (filtroPrecoMax) filtroPrecoMax.addEventListener('input', filtrar);

  if (btnLimpar) {
    btnLimpar.addEventListener('click', function() {
      filtroCategoria.value = "";
      filtroPrecoMin.value = "";
      filtroPrecoMax.value = "";
      if (barra) barra.value = "";
      filtrar();
    });
  }

  renderizarProdutos();
});

// Inicializa a lista de produtos ao carregar a página
window.onload = function() {
  renderizarProdutos();
  atualizarCarrinho();
};

// Oculta categorias ao rolar para baixo e mostra ao voltar ao topo
document.addEventListener('DOMContentLoaded', function() {
  const categoriasHeader = document.getElementById('categorias-header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 20) {
      categoriasHeader.classList.add('oculto');
    } else {
      categoriasHeader.classList.remove('oculto');
    }
  });
});