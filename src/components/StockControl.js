import React, { useState, useEffect } from "react";

const StockControl = () => {
    const [stock, setStock] = useState(() => {
        const savedStock = localStorage.getItem("stock");
        return savedStock ? JSON.parse(savedStock) : {
            Seda: [],
            Filtros: [],
            Tabacos: []
        };
    });
    
    const [productName, setProductName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [profitMargin, setProfitMargin] = useState("");
    const [category, setCategory] = useState("Seda");
    const [log, setLog] = useState([]);
    
    useEffect(() => {
        localStorage.setItem("stock", JSON.stringify(stock));
    }, [stock]);

    const handleAddProduct = () => {
        if (!productName || !quantity || !price || !profitMargin) {
            alert("Preencha todos os campos!");
            return;
        }

        const newProduct = {
            id: Date.now(),
            name: productName,
            quantity: parseInt(quantity),
            price: parseFloat(price),
            salePrice: (parseFloat(price) * (1 + parseFloat(profitMargin) / 100)).toFixed(2)
        };

        setStock(prevStock => ({
            ...prevStock,
            [category]: [...prevStock[category], newProduct]
        }));

        setLog(prevLog => [...prevLog, `Adicionado: ${newProduct.name} (${category})`]);
        setProductName("");
        setQuantity("");
        setPrice("");
        setProfitMargin("");
    };

    const handleDeleteProduct = (id, category) => {
        setStock(prevStock => {
            const updatedCategory = prevStock[category].filter(product => product.id !== id);
            return { ...prevStock, [category]: updatedCategory };
        });
        setLog(prevLog => [...prevLog, `Removido: Produto ID ${id} (${category})`]);
    };

    const handleEditProduct = (id, category) => {
        const product = stock[category].find(product => product.id === id);
        if (!product) return;
        
        setProductName(product.name);
        setQuantity(product.quantity);
        setPrice(product.price);
        setProfitMargin(((product.salePrice / product.price - 1) * 100).toFixed(2));
        
        handleDeleteProduct(id, category);
    };

    return (
        <div>
            <h1>Controle de Estoque</h1>
            <div>
                <input type="text" placeholder="Nome do Produto" value={productName} onChange={e => setProductName(e.target.value)} />
                <input type="number" placeholder="Quantidade" value={quantity} onChange={e => setQuantity(e.target.value)} />
                <input type="number" placeholder="Preço de Custo" value={price} onChange={e => setPrice(e.target.value)} />
                <input type="number" placeholder="Margem de Lucro (%)" value={profitMargin} onChange={e => setProfitMargin(e.target.value)} />
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="Seda">Seda</option>
                    <option value="Filtros">Filtros</option>
                    <option value="Tabacos">Tabacos</option>
                </select>
                <button onClick={handleAddProduct}>Adicionar Produto</button>
            </div>

            <h2>Estoque</h2>
            {Object.keys(stock).map(cat => (
                <div key={cat}>
                    <h3>{cat}</h3>
                    <ul>
                        {stock[cat].map(product => (
                            <li key={product.id}>
                                {product.name} - {product.quantity} unidades - R${product.price.toFixed(2)} (Venda: R${product.salePrice})
                                <button onClick={() => handleEditProduct(product.id, cat)}>Editar</button>
                                <button onClick={() => handleDeleteProduct(product.id, cat)}>Excluir</button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <h2>Registro de Alterações</h2>
            <ul>
                {log.map((entry, index) => (
                    <li key={index}>{entry}</li>
                ))}
            </ul>
        </div>
    );
};

export default StockControl;
