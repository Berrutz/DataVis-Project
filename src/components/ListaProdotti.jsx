import React from 'react';
import Prodotto from './Prodotto';

function ListaProdotti() {
  const prodotti = [
    { nome: "Prodotto 1", prezzo: 10 },
    { nome: "Prodotto 2", prezzo: 20 },
    { nome: "Prodotto 3", prezzo: 30 },
  ];

  return (
    <div>
      {prodotti.map((p, index) => (
        <Prodotto key={index} nome={p.nome} prezzo={p.prezzo} />
      ))}
    </div>
  );
}

export default ListaProdotti;
