"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from "@/config/config";
import Label from "@/components/ui/label/Label";

// Función para obtener los retornos del backend con paginación
const fetchRetornos = async (page = 1, sortField = "", sortOrder = "") => {
  const token = getTokenFromCookie();
  const response = await fetch(
    `${config.API_BASE_URL}/retornos-pagination?page=${page}&sort=${sortField}&order=${sortOrder}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Error al obtener los retornos");
  }
  const data = await response.json();
  return data;
};

// Función para obtener datos adicionales
const fetchAdditionalData = async () => {
  const token = getTokenFromCookie();
  const [usuariosResponse, productosResponse, lotesResponse] =
    await Promise.all([
      fetch(`${config.API_BASE_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${config.API_BASE_URL}/productos`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${config.API_BASE_URL}/lotes`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

  if (usuariosResponse.ok && productosResponse.ok && lotesResponse.ok) {
    const usuariosData = await usuariosResponse.json();
    const productosData = await productosResponse.json();
    const lotesData = await lotesResponse.json();
    return { usuariosData, productosData, lotesData };
  } else {
    throw new Error("Error al obtener datos adicionales");
  }
};

// Función para descargar el retorno en PDF
const downloadRetornoPDF = async (id: number) => {
  const token = getTokenFromCookie();
  const response = await fetch(`${config.API_BASE_URL}/retorno/${id}/pdf`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `retorno_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  } else {
    Swal.fire("Error", "No se pudo descargar el retorno.", "error");
  }
};

const RetornosPage = () => {
  const [retornos, setRetornos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortField, setSortField] = useState<string>("fecha_retorno");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [usuarios, setUsuarios] = useState<any>({});
  const [productos, setProductos] = useState<any>({});
  const [lotes, setLotes] = useState<any>({});

  useEffect(() => {
    const loadRetornos = async () => {
      try {
        const data = await fetchRetornos(currentPage, sortField, sortOrder);
        const { usuariosData, productosData, lotesData } =
          await fetchAdditionalData();

        // Convertir los arrays a objetos para un acceso más rápido
        const usuariosMap = usuariosData.reduce((acc: any, usuario: any) => {
          acc[usuario.id] = usuario.nombre;
          return acc;
        }, {});
        const productosMap = productosData.reduce((acc: any, producto: any) => {
          acc[producto.id_producto] = producto.nombre_producto;
          return acc;
        }, {});
        const lotesMap = lotesData.reduce((acc: any, lote: any) => {
          acc[lote.id_lote] = lote.codigo_lote;
          return acc;
        }, {});

        const updatedRetornos = data.data.map((retorno: any) => ({
          ...retorno,
          usuarioNombre: usuariosMap[retorno.usuario_id] || "Desconocido",
          productoNombre: productosMap[retorno.id_producto] || "Desconocido",
          loteCodigo: lotesMap[retorno.id_lote] || "Desconocido",
        }));

        setRetornos(updatedRetornos);
        setTotalPages(data.last_page);
        setUsuarios(usuariosMap);
        setProductos(productosMap);
        setLotes(lotesMap);
      } catch (err) {
        setError("Error al cargar los retornos.");
      } finally {
        setLoading(false);
      }
    };

    loadRetornos();
  }, [currentPage, sortField, sortOrder]);

  const handleSort = (field: string) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4 shadow-md rounded-lg">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Retornos</h1>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">
            Lista de Retornos
          </h2>
          {loading && <Label type="info" text="Cargando retornos" />}
          {error && <Label type="error" text={error} />}
          {/* Tabla de retornos */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
              <thead className="">
                <tr>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => handleSort("fecha_retorno")}
                  >
                    Fecha de Retorno{" "}
                    {sortField === "fecha_retorno" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-2 border-b">Código de Lote</th>
                  <th className="px-4 py-2 border-b">Nombre de Usuario</th>
                  <th className="px-4 py-2 border-b">Nombre del Producto</th>
                  <th className="px-4 py-2 border-b">Cantidad</th>
                  <th className="px-4 py-2 border-b">Motivo de Retorno</th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => handleSort("isActive")}
                  >
                    Estado{" "}
                    {sortField === "isActive" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-2 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {retornos.length > 0 ? (
                  retornos.map((retorno) => (
                    <tr key={retorno.id_comprobante} className="text-center">
                      <td className="px-4 py-2 border-b">
                        {retorno.fecha_retorno}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {retorno.loteCodigo}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {retorno.usuarioNombre}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {retorno.productoNombre}
                      </td>
                      <td className="px-4 py-2 border-b">{retorno.cantidad}</td>
                      <td className="px-4 py-2 border-b">
                        {retorno.motivo_retorno}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {retorno.isActive ? "Activo" : "Inactivo"}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          onClick={() =>
                            downloadRetornoPDF(retorno.id_comprobante)
                          }
                        >
                          Descargar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center px-4 py-2 border-b">
                      No hay retornos disponibles.
                    </td>
                  </tr>
                )}
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

export default RetornosPage;
