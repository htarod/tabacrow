// src/components/StockControl.js
import React, { useState, useEffect } from 'react';

const categories = ['Seda', 'Filtros', 'Tabacos', 'Dichavadores', 'Isqueiros', 'Mini Cuia'];

const initialProfitMargins = {
  Seda: 2.85,
  Filtros: 1.5,
  Tabacos: 2.0,
  Dichavadores: 2.0,
  Isqueiros: 1.8,
  'Mini Cuia': 2.5
};

const StockControl = () => {
  const [category, setCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState('');
  
  // Estados com persistência no localStorage
  const [profitMargin, setProfitMargin] = useState(() => {
    const saved = localStorage.getItem('profitMargin');
    return saved ? JSON.parse(saved) : initialProfitMargins;
  });

  const [stock, setStock] = useState(() => {
    const saved = localStorage.getItem('stock');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Garante que todas as categorias existam mesmo se não estiverem no localStorage
      categories.forEach(cat => {
        if (!parsed[cat]) parsed[cat] = [];
      });
      return parsed;
    }
    return Object.fromEntries(categories.map(cat => [cat, []]));
  });

  const [log, setLog] = useState(() => {
    const saved = localStorage.getItem('log');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistência automática
  useEffect(() => localStorage.setItem('stock', JSON.stringify(stock)), [stock]);
  useEffect(() => localStorage.setItem('profitMargin', JSON.stringify(profitMargin)), [profitMargin]);
  useEffect(() => localStorage.setItem('log', JSON.stringify(log)), [log]);

  const handleAddProduct = () => {
    if (!category || !productName || !quantity || !price) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const priceNum = parseFloat(price.replace(',', '.'));
    const pricePerUnit = priceNum / quantity;
    const suggestedPrice = pricePerUnit * profitMargin[category];

    const newProduct = {
      id: Date.now(),
      name: productName,
      quantity,
      price: priceNum,
      pricePerUnit,
      suggestedPrice,
      totalSuggestedPrice: suggestedPrice * quantity,
      dateAdded: new Date().toLocaleDateString('pt-BR'),
      exits: [],
    };

    setStock(prev => ({ ...prev, [category]: [...prev[category], newProduct] }));
    setLog(prev => [...prev, `Produto adicionado: ${productName} - ${category} - Quantidade: ${quantity} - Preço: R$${priceNum.toFixed(2)}`]);

    setProductName('');
    setQuantity(0);
    setPrice('');
  };

  const handleDeleteProduct = (id) => {
    const product = stock[category].find(p => p.id === id);
    setStock(prev => ({ ...prev, [category]: prev[category].filter(p => p.id !== id) }));
    setLog(prev => [...prev, `Produto removido: ${product.name} - ${category}`]);
  };

  const handleEditProduct = (id) => {
    const product = stock[category].find(p => p.id === id);
    setProductName(product.name);
    setQuantity(product.quantity);
    setPrice(product.price.toFixed(2));
    handleDeleteProduct(id);
    setLog(prev => [...prev, `Produto editado: ${product.name} - ${category} - Nova quantidade: ${quantity} - Novo preço: R$${price}`]);
  };

  // Funções de cálculo
  const calculateTotal = (cat) => stock[cat].reduce((t, p) => t + p.price, 0).toFixed(2);
  const calculateTotalSuggestedSales = (cat) => stock[cat].reduce((t, p) => t + p.totalSuggestedPrice, 0).toFixed(2);
  const calculateTotalForAllCategories = () => categories.reduce((t, cat) => t + parseFloat(calculateTotal(cat)), 0).toFixed(2);
  const calculateTotalSuggestedSalesForAllCategories = () => categories.reduce((t, cat) => t + parseFloat(calculateTotalSuggestedSales(cat)), 0).toFixed(2);

  const handleChangeProfitMargin = (category) => {
    const newMargin = prompt('Nova margem de lucro (%):');
    if (newMargin) {
      const marginValue = parseFloat(newMargin) / 100 + 1;
      setProfitMargin(prev => ({ ...prev, [category]: marginValue }));
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Controle de Estoque Tabacrow</h2>

      <select
        onChange={(e) => setCategory(e.target.value)}
        value={category}
        style={{ padding: '10px', marginBottom: '20px', fontSize: '16px' }}
      >
        <option value="">Selecione uma categoria</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>{cat}</option>
        ))}
        <option value="Todos">Todas as Categorias</option>
      </select>

      {category && category !== 'Todos' && (
        <>
          <button
            onClick={() => handleChangeProfitMargin(category)}
            style={{ padding: '10px 20px', marginBottom: '20px' }}
          >
            Alterar Margem de Lucro
          </button>

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
        </>
      )}

      {category && category !== 'Todos' && (
        <>
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
                      style={{ padding: '5px 10px', marginRight: '5px' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{ padding: '5px 10px' }}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <h3>Totais</h3>
            <p>Total Gasto: R${calculateTotal(category)}</p>
            <p>Total Sugerido: R${calculateTotalSuggestedSales(category)}</p>
          </div>
        </>
      )}

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

      <div>
        <h3>Total Geral</h3>
        <p>Total Gasto: R${calculateTotalForAllCategories()}</p>
        <p>Total Sugerido: R${calculateTotalSuggestedSalesForAllCategories()}</p>
      </div>
    </div>
  );
};

export default StockControl;