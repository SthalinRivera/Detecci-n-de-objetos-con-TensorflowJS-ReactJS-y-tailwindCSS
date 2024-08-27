// Importar dependencias
import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities"; // Función para dibujar rectángulos

function App() {
  // Referencias para la cámara web y el lienzo (canvas)
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Estado para almacenar las detecciones
  const [detections, setDetections] = useState([]);

  // Función principal para cargar el modelo y ejecutar la detección
  const runCoco = async () => {
    // Cargar el modelo COCO-SSD
    const net = await cocossd.load();
    console.log("Modelo COCO-SSD cargado.");

    // Ejecutar la detección en un intervalo de 10 ms
    setInterval(() => {
      detect(net);
    }, 10);
  };

  // Función para detectar objetos en el video
  const detect = async (net) => {
    // Verificar que la cámara web esté lista
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Obtener propiedades del video
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Ajustar ancho y alto del video
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Ajustar el tamaño del lienzo al video
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Realizar detecciones de objetos en el video
      const obj = await net.detect(video);

      // Actualizar el estado con los nombres y porcentajes de confianza
      setDetections(obj.map(prediction => ({
        class: prediction.class,
        score: (prediction.score * 100).toFixed(2) // Convertir a porcentaje y mantener dos decimales
      })));

      // Obtener el contexto del lienzo y dibujar los resultados
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx); // Dibujar rectángulos alrededor de los objetos detectados
    }
  };

  // Hook de efecto para ejecutar runCoco cuando el componente se monta
  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div className="App">
      <header className="">
      </header>
      <div>
        <h3 className="text-xl my-4 font-bold">Detección de objetos con TensorflowJS, ReactJS y tailwindCSS</h3>
      </div>
      {/* Componente Webcam para capturar video */}

      <div className="">
        <Webcam
          className="bg-slate-100 shadow-lg rounded-xl"
          ref={webcamRef}
          muted={true} // Silenciar el audio
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9, // Asegurar que el video esté por encima del lienzo
            width: 640,
            height: 480,
          }}
        />

        {/* Lienzo (canvas) para dibujar los rectángulos */}
        <canvas
          ref={canvasRef}
          className=" rounded-xl"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8, // Asegurar que el lienzo esté detrás del video
            width: 640,
            height: 480,
          }}
        />
      </div>
      <div class="max-w-xs bg-slate-950 border border-gray-200 rounded-xl shadow-lg" >
      <h3 className="text-slate-100 font-bold">Objetos detectados:</h3>
      {detections.map((detection, index) => (
        <div class="flex p-4">
          <div class="ms-3">
            <p key={index} class="text-sm text-slate-100">
            {detection.class}: {detection.score}%
            </p>
          </div>
        </div>
           ))}
      </div>

    </div>
  );
}

export default App;
