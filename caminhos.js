document.addEventListener("DOMContentLoaded", function () {
  const paginaPrincipal = document.querySelector("#pagina-inicial");
  const paginaCarrinho = document.querySelector("#pagina-carrinho");
  const carrinhoIcon = document.querySelector(".carrinho-icon");
  const carrinhoVerButtom = document.querySelector("#carrinho-ver-buttom");
  const headerTitulo = document.querySelector("header h1");

  function IrPaginaCarrinho() {
    if (paginaCarrinho && paginaPrincipal) {
      paginaCarrinho.style.display = "block";
      paginaPrincipal.style.display = "none";
    }
  }
  function IrPaginaPrincipal() {
    if (paginaPrincipal && paginaCarrinho) {
      paginaPrincipal.style.display = "block";
      paginaCarrinho.style.display = "none";
    }
  }

  // Eventos
  if (carrinhoIcon) carrinhoIcon.addEventListener("click", IrPaginaCarrinho);
  if (carrinhoVerButtom) carrinhoVerButtom.addEventListener("click", IrPaginaCarrinho);
  if (headerTitulo) headerTitulo.addEventListener("click", IrPaginaPrincipal);
});
