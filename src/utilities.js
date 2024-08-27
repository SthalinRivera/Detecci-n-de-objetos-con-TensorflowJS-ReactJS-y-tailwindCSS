export const drawRect = (detections, ctx) => {
    // Iterar sobre cada predicción (objeto detectado)
    detections.forEach(prediction => {
  
      // Extraer las coordenadas del cuadro delimitador (bbox) y la clase del objeto
      const [x, y, width, height] = prediction['bbox'];
      const text = prediction['class'];
  
      // Generar un color aleatorio para el borde del rectángulo
      const borderColor = Math.floor(Math.random() * 16777215).toString(16);
  
      // Convertir el color hexadecimal a RGB
      const r = parseInt(borderColor.substring(0, 2), 16);
      const g = parseInt(borderColor.substring(2, 4), 16);
      const b = parseInt(borderColor.substring(4, 6), 16);
  
      // Establecer el color del borde y el grosor del rectángulo
      ctx.strokeStyle = `#${borderColor}`;
      ctx.lineWidth = 2;
  
      // Establecer el color de relleno utilizando el color del borde pero con opacidad
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`; // Color del borde con 30% de opacidad
  
      // Dibujar el rectángulo y el texto
      ctx.beginPath(); // Iniciar el trazado
      ctx.rect(x, y, width, height); // Dibujar el rectángulo usando las coordenadas y dimensiones
      ctx.fill(); // Rellenar el rectángulo con el color semitransparente
      ctx.stroke(); // Dibujar el borde del rectángulo
  
      // Dibujar el nombre del objeto detectado
      ctx.font = '18px Arial';
      ctx.fillStyle = `#${borderColor}`; // Color del texto coincidente con el borde
      ctx.fillText(text, x, y > 10 ? y - 5 : 10); // Dibujar el texto justo encima del rectángulo
    });
  }
  