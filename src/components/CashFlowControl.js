// src/components/CashFlowControl.js
import React, { useState } from 'react';

const CashFlowControl = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const handleAddTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
    setTotalBalance(totalBalance + transaction.value);
  };

  return (
    <div>
      <h2>Fluxo de Caixa</h2>
      <div>
        <h3>Transações</h3>
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index}>
              {transaction.type}: R${transaction.value.toFixed(2)}
            </li>
          ))}
        </ul>
        <h3>Saldo: R${totalBalance.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default CashFlowControl;
