"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from '@/config/config';
import Label from "@/components/ui/label/Label";
import { useTagModal } from "@/hooks/modals/useTagModal";
import TagModal from "@/components/ui/modals/TagModal";

// Función para obtener los datos de etiquetas del backend con paginación
const fetchEtiquetas = async (page: number) => {
  const token = getTokenFromCookie();
  const response = await fetch(`${config.API_BASE_URL}/etiquetas-pagination?page=${page}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Error al obtener las etiquetas');
  }
  const data = await response.json();
  return data;
};

// Función para enviar los datos de la nueva etiqueta al backend
const submitEtiquetaData = async (etiquetaData: any) => {
  const token = getTokenFromCookie();
  const response = await fetch(`${config.API_BASE_URL}/etiquetas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(etiquetaData),
  });
  if (!response.ok) {
    throw new Error('Error al enviar los datos de la etiqueta');
  }
  return response.json();
};

const EtiquetasPage = () => {
  const tagModal = useTagModal();
  const [etiquetas, setEtiquetas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // Página actual
  const [totalPages, setTotalPages] = useState<number>(1); // Total de páginas
  const [showCreateLabelForm, setShowCreateLabelForm] = useState<boolean>(false);

  useEffect(() => {
    const loadEtiquetas = async () => {
      try {
        setLoading(true);
        const data = await fetchEtiquetas(currentPage);
        setEtiquetas(data.data); // Accede al array de datos en la respuesta
        setTotalPages(data.last_page); // Establece el número total de páginas
      } catch (err) {
        setError("Error al cargar las etiquetas.");
      } finally {
        setLoading(false);
      }
    };

    loadEtiquetas();
  }, [currentPage]); // Vuelve a cargar las etiquetas cuando cambie la página actual

  const handleAddNewLabel = () => {
    setShowCreateLabelForm(true);
  };

  const handleSubmitEtiqueta = async (etiquetaData: any) => {
    try {
      const response = await submitEtiquetaData(etiquetaData);

      if (response && response.message) {
        const nuevaEtiqueta = response.etiqueta;
        if (nuevaEtiqueta && nuevaEtiqueta.id_etiqueta) {
          setEtiquetas([...etiquetas, nuevaEtiqueta]);
          setShowCreateLabelForm(false);
          Swal.fire("Éxito", response.message, "success");
        } else {
          Swal.fire("Error", "No se pudo crear la etiqueta correctamente.", "error");
        }
      } else {
        Swal.fire("Error", "No se recibió una respuesta válida del servidor.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un problema al crear la etiqueta", "error");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage); // Cambia la página actual
    }
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4 ">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Etiquetas</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nueva Etiqueta"
            type="button"
            variant="primary"
            onClick={tagModal.onOpen}
          />
        </div>
        <TagModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Etiquetas Disponibles</h2>
          {loading && <Label type="info" text="Cargando etiquetas" />}
          {error && <Label type="error" text={error} />}
          {/* Tabla de etiquetas */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Nombre</th>
                  <th className="px-4 py-2 border-b">Color</th>
                  <th className="px-4 py-2 border-b">Activo</th>
                  <th className="px-4 py-2 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {etiquetas.map(etiqueta => (
                  <tr key={etiqueta.id_etiqueta} className="text-center">
                    <td className="px-4 py-2 border-b">{etiqueta.nombre}</td>
                    <td className="px-4 py-2 border-b">
                      <div className="w-4 h-4 inline-block" style={{ backgroundColor: etiqueta.color_hex }} />
                    </td>
                    <td className="px-4 py-2 border-b">{etiqueta.isActive ? "Sí" : "No"}</td>
                    <td className="px-4 py-2 border-b">
                      <Button label="Editar" type="button" variant="outline" onClick={() => { }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EtiquetasPage;
