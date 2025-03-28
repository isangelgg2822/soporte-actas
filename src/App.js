import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';

function App() {
  const [actaType, setActaType] = useState('entrega'); // 'entrega' o 'salida'
  const [formData, setFormData] = useState({
    fecha: '',
    lugar: '',
    personaAsignada: '',
    cedula: '',
    desde: '', // Para el acta de salida
    hacia: '', // Para el acta de salida
  });
  const [equipment, setEquipment] = useState([
    { serie: '', descripcion: '', cantidad: '' },
  ]);
  const [previewData, setPreviewData] = useState(null); // Estado para la vista previa

  const addEquipment = () => {
    setEquipment([...equipment, { serie: '', descripcion: '', cantidad: '' }]);
  };

  const removeEquipment = (index) => {
    setEquipment(equipment.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const newEquipment = [...equipment];
    newEquipment[index][field] = value;
    setEquipment(newEquipment);
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const generatePDF = () => {
    try {
      // Validar datos antes de generar el PDF
      if (!formData.fecha || !formData.lugar || !formData.personaAsignada || !formData.cedula) {
        throw new Error('Por favor, completa todos los campos obligatorios (Fecha, Lugar, Persona Asignada, Cédula).');
      }

      if (equipment.length === 0) {
        throw new Error('Debes agregar al menos un equipo.');
      }

      if (actaType === 'salida' && (!formData.desde || !formData.hacia)) {
        throw new Error('Por favor, completa los campos "Desde" y "Hacia" para el Acta de Salida.');
      }

      const doc = new jsPDF();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);

      // Título
      doc.text('ACTA DE ENTREGA DE EQUIPOS Y HERRAMIENTAS', 105, 20, { align: 'center' });
      doc.text('CORPORACIÓN MODO CARACAS, C.A.', 105, 30, { align: 'center' });

      // Información general (en una tabla)
      let yPosition = 50;
      doc.setFontSize(10);
      doc.text('Fecha:', 20, yPosition);
      doc.text(formData.fecha || 'No especificado', 50, yPosition);
      doc.line(50, yPosition + 1, 190, yPosition + 1); // Línea debajo del texto
      yPosition += 10;

      doc.text('Persona Asignada:', 20, yPosition);
      doc.text(formData.personaAsignada || 'No especificado', 50, yPosition);
      doc.line(50, yPosition + 1, 190, yPosition + 1);
      yPosition += 10;

      doc.text('Lugar:', 20, yPosition);
      doc.text(formData.lugar || 'No especificado', 50, yPosition);
      doc.line(50, yPosition + 1, 190, yPosition + 1);
      yPosition += 20;

      // Tabla de equipos
      doc.setFontSize(10);
      doc.text('SERIE O REFERENCIA DEL EQUIPO', 20, yPosition);
      doc.text('DESCRIPCIÓN', 80, yPosition);
      doc.text('CANTIDAD', 140, yPosition);
      yPosition += 5;
      doc.line(20, yPosition, 190, yPosition); // Línea horizontal debajo de los encabezados
      yPosition += 5;

      equipment.forEach((item) => {
        doc.text(item.serie || 'No especificado', 20, yPosition);
        doc.text(item.descripcion || 'No especificado', 80, yPosition);
        doc.text(item.cantidad || 'No especificado', 140, yPosition);
        yPosition += 10;
        doc.line(20, yPosition - 5, 190, yPosition - 5); // Línea horizontal entre filas
      });

      // Texto del acta
      let finalY = yPosition + 20;
      doc.setFontSize(10);
      let actaText = '';
      if (actaType === 'entrega') {
        actaText = `Yo, ${formData.personaAsignada || 'No especificado'}, titular de la cédula de identidad Nro. ${formData.cedula || 'No especificado'}, declaro haber recibido mediante la presente Acta, los equipos mencionados en este documento en perfectas condiciones de operatividad, los cuales me comprometo a cuidar y utilizar únicamente en las actividades inherentes a las funciones que me sean asignadas, de igual manera a devolverlos cuando me sean requeridos, en las mismas condiciones de operatividad en que los estoy recibiendo, a tales efectos autorizo a la Corporación Modo Caracas a que me descuente los equipos que me fueron asignados en caso de no devolverlos al momento que me sean requeridos si no existiere una causa comprobable que lo justifique.`;
        doc.text(actaText, 20, finalY, { maxWidth: 170 });
      } else {
        actaText = `Yo, ${formData.personaAsignada || 'No especificado'}, portador de la cédula de identidad ${formData.cedula || 'No especificado'}, autorizo la salida de los equipos mencionados en este documento desde ${formData.desde || 'No especificado'} hacia ${formData.hacia || 'No especificado'} y con mi firma doy fe de que la persona asignada se hará cargo del traslado y cumplirá responsablemente con esta tarea.`;
        doc.text(actaText, 20, finalY, { maxWidth: 170 });
      }

      // Firmas
      finalY = yPosition + 80;
      doc.text('______________________________', 20, finalY);
      doc.text('QUIEN ENTREGA', 40, finalY + 10);
      doc.text('______________________________', 80, finalY);
      doc.text('QUIEN RECIBE', 100, finalY + 10);
      doc.text('______________________________', 140, finalY);
      doc.text('RESPONSABLE DEL ÁREA', 150, finalY + 10);

      // Generar la vista previa
      setPreviewData({
        fecha: formData.fecha || 'No especificado',
        lugar: formData.lugar || 'No especificado',
        personaAsignada: formData.personaAsignada || 'No especificado',
        cedula: formData.cedula || 'No especificado',
        desde: formData.desde || 'No especificado',
        hacia: formData.hacia || 'No especificado',
        equipment: equipment.map((item) => ({
          serie: item.serie || 'No especificado',
          descripcion: item.descripcion || 'No especificado',
          cantidad: item.cantidad || 'No especificado',
        })),
        actaText,
        actaType,
      });

      // Descargar el PDF
      doc.save(`Acta_${actaType === 'entrega' ? 'Entrega' : 'Salida'}_Equipos.pdf`);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert(`Hubo un error al generar el PDF: ${error.message}. Por favor, revisa los datos e intenta de nuevo.`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="App">
      <header className="header">
        <h1>ACTA SOPORTE TÉCNICO MODO</h1>
        <table className="acta-options-table">
          <tbody>
            <tr>
              <td>
                <button
                  className={`acta-option-btn ${actaType === 'entrega' ? 'active' : ''}`}
                  onClick={() => setActaType('entrega')}
                >
                  Acta de Entrega de Equipos
                </button>
              </td>
              <td>
                <button
                  className={`acta-option-btn ${actaType === 'salida' ? 'active' : ''}`}
                  onClick={() => setActaType('salida')}
                >
                  Acta de Salida de Equipos
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <main>
        <h2>
          {actaType === 'entrega'
            ? 'Acta de Entrega de Equipos y Herramientas'
            : 'Acta de Salida de Equipos y Herramientas'}
        </h2>

        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>FECHA</label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => handleFormChange('fecha', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>LUGAR</label>
            <input
              type="text"
              value={formData.lugar}
              onChange={(e) => handleFormChange('lugar', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>EQUIPOS</label>
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Serie de Referencia</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={item.serie}
                        onChange={(e) =>
                          handleInputChange(index, 'serie', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.descripcion}
                        onChange={(e) =>
                          handleInputChange(index, 'descripcion', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.cantidad}
                        onChange={(e) =>
                          handleInputChange(index, 'cantidad', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => removeEquipment(index)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="form-group">
            <label>PERSONA ASIGNADA</label>
            <input
              type="text"
              value={formData.personaAsignada}
              onChange={(e) =>
                handleFormChange('personaAsignada', e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>CÉDULA DE IDENTIDAD</label>
            <input
              type="text"
              value={formData.cedula}
              onChange={(e) => handleFormChange('cedula', e.target.value)}
            />
          </div>

          {actaType === 'salida' && (
            <>
              <div className="form-group">
                <label>DESDE</label>
                <input
                  type="text"
                  value={formData.desde}
                  onChange={(e) => handleFormChange('desde', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>HACIA</label>
                <input
                  type="text"
                  value={formData.hacia}
                  onChange={(e) => handleFormChange('hacia', e.target.value)}
                />
              </div>
            </>
          )}

          <button
            type="button"
            className="add-equipment-btn"
            onClick={addEquipment}
          >
            + Agregar Equipo
          </button>

          <button type="button" className="submit-btn" onClick={generatePDF}>
            Generar Acta
          </button>
        </form>

        {/* Sección de Vista Previa */}
        {previewData && (
          <div className="preview-section">
            <h3>Vista Previa del Acta</h3>
            <div className="preview-content">
              <h4>ACTA DE ENTREGA DE EQUIPOS Y HERRAMIENTAS</h4>
              <h4>CORPORACIÓN MODO CARACAS, C.A.</h4>

              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="label">Fecha:</td>
                    <td>{previewData.fecha}</td>
                  </tr>
                  <tr>
                    <td className="label">Persona Asignada:</td>
                    <td>{previewData.personaAsignada}</td>
                  </tr>
                  <tr>
                    <td className="label">Lugar:</td>
                    <td>{previewData.lugar}</td>
                  </tr>
                </tbody>
              </table>

              <table className="preview-table">
                <thead>
                  <tr>
                    <th>SERIE O REFERENCIA DEL EQUIPO</th>
                    <th>DESCRIPCIÓN</th>
                    <th>CANTIDAD</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.equipment.map((item, index) => (
                    <tr key={index}>
                      <td>{item.serie}</td>
                      <td>{item.descripcion}</td>
                      <td>{item.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="acta-text">{previewData.actaText}</p>

              <div className="signatures">
                <div className="signature">
                  <p>______________________________</p>
                  <p>QUIEN ENTREGA</p>
                </div>
                <div className="signature">
                  <p>______________________________</p>
                  <p>QUIEN RECIBE</p>
                </div>
                <div className="signature">
                  <p>______________________________</p>
                  <p>RESPONSABLE DEL ÁREA</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer>
        <span>Vista Previa</span>
        <div className="footer-buttons">
          <button className="print-btn" onClick={handlePrint}>
            Imprimir
          </button>
          <button className="download-btn" onClick={generatePDF}>
            Descargar PDF
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;