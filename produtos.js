// Banco de dados de produtos (simples, em JS)
const produtos = [
  { id: 1, nome: "Camiseta Estilosa", preco: 59.90, categoria: "Roupas", imagem: "https://placehold.co/400x300?text=Camiseta+Estilosa" },
  { id: 2, nome: "Tênis Moderno", preco: 199.90, categoria: "Calçados", imagem: "https://placehold.co/400x300?text=T%C3%AAnis+Moderno" },
  { id: 3, nome: "Relógio Digital", preco: 149.90, categoria: "Acessórios", imagem: "https://placehold.co/400x300?text=Rel%C3%B3gio+Digital" },
  { id: 4, nome: "Boné Urbano", preco: 39.90, categoria: "Acessórios", imagem: "https://placehold.co/400x300?text=Bon%C3%A9+Urbano" },
  { id: 5, nome: "Mochila Escolar", preco: 89.90, categoria: "Acessórios", imagem: "https://placehold.co/400x300?text=Mochila+Escolar" },
  { id: 6, nome: "Fone Bluetooth", preco: 129.90, categoria: "Eletrônicos", imagem: "https://placehold.co/400x300?text=Fone+Bluetooth" },
  { id: 7, nome: "Óculos de Sol", preco: 79.90, categoria: "Acessórios", imagem: "https://placehold.co/400x300?text=%C3%93culos+de+Sol" },
  { id: 8, nome: "Carteira Couro", preco: 49.90, categoria: "Acessórios", imagem: "https://placehold.co/400x300?text=Carteira+Couro" },
  { id: 9, nome: "Pulseira Fitness", preco: 99.90, categoria: "Acessórios", imagem: "https://placehold.co/400x300?text=Pulseira+Fitness" },
  { id: 10, nome: "Chinelo Confort", preco: 29.90, categoria: "Calçados", imagem: "https://placehold.co/400x300?text=Chinelo+Confort" },
  { id: 11, nome: "Jaqueta Corta Vento", preco: 159.90, categoria: "Roupas", imagem: "https://placehold.co/400x300?text=Jaqueta+Corta+Vento" },
  { id: 12, nome: "Meia Esportiva", preco: 19.90, categoria: "Roupas", imagem: "https://placehold.co/400x300?text=Meia+Esportiva" },
];

// Gerar mais produtos automaticamente para chegar a 100
const categoriasExtras = ["Roupas", "Acessórios", "Calçados", "Eletrônicos", "Outros"];
for (let i = 13; i <= 50; i++) {
  produtos.push({
    id: i,
    nome: `Produto ${i}`,
    preco: (Math.random() * 200 + 10).toFixed(2) * 1,
    categoria: categoriasExtras[Math.floor(Math.random() * categoriasExtras.length)],
    imagem: `https://placehold.co/400x300?text=Produto+${i}`
  });
}