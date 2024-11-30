"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from '@/config/config';
import SiteModal from "@/components/ui/modals/SitesModal";
import useSitesModal from "@/hooks/modals/useSitesModal";
import Label from "@/components/ui/label/Label";

// Función para obtener los datos de sitios del backend con paginación y ordenación
const fetchSites = async (page = 1, sortField = "", sortOrder = "") => {
  const token = getTokenFromCookie();

  const response = await fetch(
    `${config.API_BASE_URL}/sitios-pagination?page=${page}&sort=${sortField}&order=${sortOrder}`,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
 
  if (!response.ok) {
    throw new Error('Error al obtener los sitios');
  }
  const data = await response.json();
  console.log(data);
  return data;
};

// Función para crear un nuevo sitio
const createSite = async (sitioData: any) => {
  const token = getTokenFromCookie();
  const response = await fetch(`${config.API_BASE_URL}/sitios`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(sitioData)
  });

  if (!response.ok) {
    throw new Error('Error al crear el sitio');
  }

  const data = await response.json();
  return data;
};

const SitesPage = () => {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortField, setSortField] = useState<string>("nombre_sitio");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [showForm, setShowForm] = useState<boolean>(false);

  const sitesModal = useSitesModal(); 
  
  useEffect(() => {
    const loadSites = async () => {
      try {
        const data = await fetchSites(currentPage, sortField, sortOrder);
        setSites(data.data);
        setTotalPages(data.last_page);
      } catch (err) {
        setError("Error al cargar los sitios.");
      } finally {
        setLoading(false);
      }
    };

    loadSites();
  }, [currentPage, sortField, sortOrder]);

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCreateSite = async (sitioData: any) => {
    try {
      const response = await createSite(sitioData);
      Swal.fire("Éxito", response.message, "success");
      setShowForm(false);
      // Recargar los sitios después de crear uno nuevo
      const data = await fetchSites(currentPage, sortField, sortOrder);
      setSites(data.data);
      setTotalPages(data.last_page);
    } catch (err) {
      Swal.fire("Error", "No se pudo crear el sitio.", "error");
    }
  };


  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4 shadow-md rounded-lg">
        <div className="text-start w-full mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Administración de Bodegas</h1>
        </div>
        <div>
          <Button
              label="Crear Nueva Bodega"
              type="button"
              variant="primary"
              onClick={sitesModal.onOpen}
            />
        </div>
        <SiteModal />
        <div className="flex flex-col w-full mt-3">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Bodegas Disponibles</h2>
          {loading && <Label type="info" text="Cargando sitios" />}
          {error && <Label type="error" text={error} />}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
              <thead>
                <tr>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => handleSort("nombre_sitio")}
                  >
                    Nombre de la bodega {sortField === "nombre_sitio" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => handleSort("direccion")}
                  >
                    Dirección {sortField === "direccion" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => handleSort("ciudad")}
                  >
                    Ciudad {sortField === "ciudad" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => handleSort("pais")}
                  >
                    País {sortField === "pais" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-2 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sites.map(site => (
                  <tr key={site.id_sitio} className="text-center">
                    <td className="px-4 py-2 border-b">{site.nombre_sitio}</td>
                    <td className="px-4 py-2 border-b">{site.direccion}</td>
                    <td className="px-4 py-2 border-b">{site.ciudad}</td>
                    <td className="px-4 py-2 border-b">{site.pais}</td>
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

export default SitesPage;
