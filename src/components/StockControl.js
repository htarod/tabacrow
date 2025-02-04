// src/components/StockControl.js
import React, { useState } from 'react';

const categories = ['Seda', 'Filtros', 'Tabacos'];

const StockControl = () => {
  const [category, setCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState('');
  const [profitMargin, setProfitMargin] = useState({
    Seda: 2.85, // 185% de lucro (em termos de multiplicador)
    Filtros: 1.5, // Valor de exemplo para Filtros (margem menor)
    Tabacos: 2.0, // Valor de exemplo para Tabacos
  });
  const [stock, setStock] = useState({
    Seda: [],
    Filtros: [],
    Tabacos: [],
  });
  
  // Estado para armazenar o log de edições
  const [log, setLog] = useState([]);

  const handleAddProduct = () => {
    if (!category || !productName || !quantity || !price) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const priceNum = parseFloat(price.replace(',', '.')); // Garantir o formato correto de preço
    const pricePerUnit = priceNum / quantity;

    // Aplicando a margem de lucro específica para cada categoria
    const suggestedPrice = pricePerUnit * profitMargin[category];

    const newProduct = {
      id: Date.now(), // ID único para cada produto
      name: productName,
      quantity,
      price: priceNum,
      pricePerUnit,
      suggestedPrice,
      totalSuggestedPrice: suggestedPrice * quantity, // Cálculo do valor total da caixa com base no valor sugerido
      dateAdded: new Date().toLocaleDateString('pt-BR'), // Adicionando a data no formato dd/mm/aaaa
      exits: [], // Registro das saídas
    };

    // Atualizando o estado do estoque
    setStock(prevStock => {
      const newStock = { ...prevStock };
      newStock[category] = [...newStock[category], newProduct]; // Adicionando o novo produto
      return newStock;
    });

    // Log da adição
    setLog(prevLog => [
      ...prevLog,
      `Produto adicionado: ${productName} - Categoria: ${category} - Quantidade: ${quantity} - Preço: R$${priceNum.toFixed(2)}`
    ]);

    // Limpar os campos após adicionar o produto
    setProductName('');
    setQuantity(0);
    setPrice('');
  };

  const handleDeleteProduct = (id) => {
    const productNameDeleted = stock[category].find(product => product.id === id).name;

    setStock(prevStock => {
      const newStock = { ...prevStock };
      newStock[category] = newStock[category].filter(product => product.id !== id);
      return newStock;
    });

    // Log da exclusão
    setLog(prevLog => [
      ...prevLog,
      `Produto removido: ${productNameDeleted} - Categoria: ${category}`
    ]);
  };

  const handleEditProduct = (id) => {
    const product = stock[category].find(p => p.id === id);
    setProductName(product.name);
    setQuantity(product.quantity);
    setPrice(product.price.toFixed(2));
    handleDeleteProduct(id);

    // Log da edição
    setLog(prevLog => [
      ...prevLog,
      `Produto editado: ${product.name} - Categoria: ${category} - Nova quantidade: ${quantity} - Novo preço: R$${price}`
    ]);
  };

  // Calcular total gasto em cada categoria
  const calculateTotal = (category) => {
    return stock[category].reduce((total, product) => total + product.price, 0).toFixed(2);
  };

  // Calcular o total sugerido de venda por categoria
  const calculateTotalSuggestedSales = (category) => {
    return stock[category].reduce((total, product) => total + product.totalSuggestedPrice, 0).toFixed(2);
  };

  // Calcular o total de todas as categorias (só o valor gasto na compra)
  const calculateTotalForAllCategories = () => {
    let total = 0;
    Object.keys(stock).forEach((cat) => {
      total += stock[cat].reduce((catTotal, product) => catTotal + product.price, 0);
    });
    return total.toFixed(2);
  };

  // Calcular o total de vendas sugeridas para todas as categorias
  const calculateTotalSuggestedSalesForAllCategories = () => {
    let total = 0;
    Object.keys(stock).forEach((cat) => {
      total += stock[cat].reduce((catTotal, product) => catTotal + product.totalSuggestedPrice, 0);
    });
    return total.toFixed(2);
  };

  // Alterar margem de lucro por categoria
  const handleChangeProfitMargin = (category) => {
    const newMargin = prompt('Insira a nova margem de lucro (em porcentagem, ex: 185 para 185%)');
    if (newMargin) {
      const marginValue = parseFloat(newMargin) / 100 + 1; // Converter porcentagem para multiplicador
      setProfitMargin(prevMargin => ({ ...prevMargin, [category]: marginValue }));
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Controle de Estoque Tabacrow</h2>

      {/* Dropdown para escolher a categoria */}
      <select
        onChange={(e) => setCategory(e.target.value)}
        value={category}
        style={{ padding: '10px', marginBottom: '20px', fontSize: '16px' }}
      >
        <option value="">Selecione uma categoria</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
        <option value="Todos">Todas as Categorias</option>
      </select>

      {/* Botão de alteração da margem de lucro */}
      {category && category !== 'Todos' && (
        <button
          onClick={() => handleChangeProfitMargin(category)}
          style={{ padding: '10px 20px', marginBottom: '20px' }}
        >
          Alterar Margem de Lucro
        </button>
      )}

      {/* Campos para nome, quantidade e preço */}
      {category && category !== 'Todos' && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Nome do Produto"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={{ padding: '10px', marginRight: '10px', width: '200px' }}
          />
          <input
            type="number"
            placeholder="Quantidade por Caixa"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{ padding: '10px', marginRight: '10px', width: '200px' }}
          />
          <input
            type="text"
            placeholder="Valor da Caixa"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ padding: '10px', marginRight: '10px', width: '200px' }}
          />
          <button
            onClick={handleAddProduct}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Adicionar Produto
          </button>
        </div>
      )}

      {/* Exibição dos produtos cadastrados por categoria em formato de tabela */}
      {category && category !== 'Todos' && (
        <div>
          <table style={{ width: '80%', margin: '0 auto', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Produto</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Quantidade</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Preço Pago</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Preço Unitário</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Preço Sugerido</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Valor Total Sugerido</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Data de Adição</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {stock[category].map((product) => (
                <tr key={product.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.quantity}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>R${product.price.toFixed(2)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>R${product.pricePerUnit.toFixed(2)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>R${product.suggestedPrice.toFixed(2)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>R${product.totalSuggestedPrice.toFixed(2)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.dateAdded}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleEditProduct(product.id)}
                      style={{ padding: '5px 10px', fontSize: '14px', marginRight: '5px' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{ padding: '5px 10px', fontSize: '14px' }}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Exibindo o log de edições */}
      {category === 'Todos' && (
        <div>
          <h3>Log de Edições</h3>
          <ul>
            {log.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Totais por categoria */}
      {category && category !== 'Todos' && (
        <div>
          <h3>Totais</h3>
          <p>Total Gasto: R${calculateTotal(category)}</p>
          <p>Total Sugerido: R${calculateTotalSuggestedSales(category)}</p>
        </div>
      )}

      {/* Totais para todas as categorias */}
      <div>
        <h3>Total Geral</h3>
        <p>Total Gasto em Todas as Categorias: R${calculateTotalForAllCategories()}</p>
        <p>Total Sugerido para Venda em Todas as Categorias: R${calculateTotalSuggestedSalesForAllCategories()}</p>
      </div>
    </div>
  );
};

export default StockControl;
