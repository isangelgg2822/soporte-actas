import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>ACTA SOPORTE TÉCNICO MODO</h1>
        <nav>
          <a href="#entrega">Acta de Asignación de Equipos</a>
          <a href="#salida">Acta de Salida de Equipos</a>
        </nav>
      </header>

      <main>
        <h2>Acta de Entrega de Equipos y Herramientas</h2>
        <form className="form">
          <div className="form-group">
            <label>FECHA</label>
            <input type="text" value="21/03/2025" readOnly />
          </div>

          <div className="form-group">
            <label>LUGAR</label>
            <input type="text" value="MODO CARACAS" readOnly />
          </div>

          <div className="form-group">
            <label>EQUIPOS</label>
            <div className="equipment-row">
              <div className="equipment-field">
                <label>Serie de Referencia</label>
                <input type="text" value="mdkfvkndvs" readOnly />
              </div>
              <div className="equipment-field">
                <label>Descripción</label>
                <input type="text" value="hsxbjhasb" readOnly />
              </div>
              <div className="equipment-field">
                <label>Cantidad</label>
                <input type="text" value="1" readOnly />
              </div>
              <button className="delete-btn">🗑️</button>
            </div>
          </div>

          <div className="form-group">
            <label>PERSONA ASIGNADA</label>
            <input type="text" value="Isangel Gonzalez" readOnly />
          </div>

          <div className="form-group">
            <label>CÉDULA DE IDENTIDAD</label>
            <input type="text" value="2350872" readOnly />
          </div>

          <button type="button" className="add-equipment-btn">
            + Agregar Equipo
          </button>

          <button type="submit" className="submit-btn">
            Generar Acta de Entrega
          </button>
        </form>
      </main>

      <footer>
        <span>Vista Previa</span>
        <div className="footer-buttons">
          <button className="print-btn">Imprimir</button>
          <button className="download-btn">Descargar PDF</button>
        </div>
      </footer>
    </div>
  );
}

export default App;