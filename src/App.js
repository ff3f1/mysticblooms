import React, { useState } from "react";
import "./App.css";

const recipients = ["Девушке", "Маме", "Коллеге", "Сестре", "Себе"];
const suggestions = {
  Девушке: "Нежный букет с пионами и розами — романтично и утончённо.",
  Маме: "Букет с хризантемами и лилиями — забота и тепло в каждом лепестке.",
  Коллеге: "Минималистичный букет с эустомами — сдержанно и стильно.",
  Сестре: "Яркий микс гербер и тюльпанов — для хорошего настроения!",
  Себе: "Собери свой идеальный букет — ты этого заслуживаешь 💐",
};

function App() {
  const [recipient, setRecipient] = useState("");

  return (
    <div className="App">
      <h1>MysticBlooms: Подбор букета</h1>
      <div className="buttons">
        {recipients.map((r) => (
          <button key={r} onClick={() => setRecipient(r)}>{r}</button>
        ))}
      </div>
      {recipient && (
        <div className="card">
          <h2>Подарок для: {recipient}</h2>
          <p>{suggestions[recipient]}</p>
          <a href="https://t.me/твой_канал" target="_blank" rel="noreferrer">Заказать в MysticBlooms</a>
        </div>
      )}
    </div>
  );
}

export default App;
