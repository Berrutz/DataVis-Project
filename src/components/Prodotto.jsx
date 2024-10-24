import React, { useState } from 'react';

function Prodotto({ nome, prezzo }) {
  const [aggiunto, setAggiunto] = useState(false);

  return (
    <div>
      <h3>{nome}</h3>
      <p>Prezzo: €{prezzo}</p>
      <button onClick={() => setAggiunto(true)}>
        {aggiunto ? "Aggiunto al carrello" : "Aggiungi al carrello"}
      </button>
    </div>
  );
}

export default Prodotto;
