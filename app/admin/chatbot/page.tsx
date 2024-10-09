"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from "@/config/config";

// Función para obtener las preguntas del backend
const fetchQuestions = async (page = 1, sortField = "", sortOrder = "") => {
  const token = getTokenFromCookie();
  const response = await fetch(
    `${config.API_BASE_URL}/questions?page=${page}&sort=${sortField}&order=${sortOrder}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Error al obtener las preguntas");
  }
  const data = await response.json();
  return data;
};

// Función para manejar la creación de nuevas preguntas
const createQuestion = async (question: string, response: string) => {
  const token = getTokenFromCookie();
  const responseApi = await fetch(`${config.API_BASE_URL}/questions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, response }),
  });
  if (!responseApi.ok) {
    throw new Error("Error al guardar la pregunta");
  }
  return responseApi.json();
};

const ChatBotPage = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortField, setSortField] = useState<string>("question");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newResponse, setNewResponse] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestions(currentPage, sortField, sortOrder);
        setQuestions(data.data);
        setTotalPages(data.last_page);
      } catch (err) {
        setError("Error al cargar las preguntas.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
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

  const handleCreateQuestion = async () => {
    try {
      await createQuestion(newQuestion, newResponse);
      Swal.fire(
        "Éxito",
        "Pregunta y respuesta guardadas con éxito.",
        "success"
      );
      setNewQuestion("");
      setNewResponse("");
      setShowForm(false);
      // Recargar preguntas después de agregar una nueva
      const data = await fetchQuestions(currentPage, sortField, sortOrder);
      setQuestions(data.data);
      setTotalPages(data.last_page);
    } catch (err) {
      Swal.fire("Error", "No se pudo guardar la pregunta.", "error");
    }
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4 shadow-md rounded-lg">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold text-white">
            Administración de Preguntas del ChatBot
          </h1>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-200 mb-4">
            Lista de Preguntas
          </h2>
          {loading && <p className="text-gray-400">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-600 rounded-lg shadow-sm">
              <thead>
                <tr>
                  <th
                    className="px-4 py-2 border-b cursor-pointer text-gray-300"
                    onClick={() => handleSort("question")}
                  >
                    Pregunta{" "}
                    {sortField === "question" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer text-gray-300"
                    onClick={() => handleSort("response")}
                  >
                    Respuesta{" "}
                    {sortField === "response" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-2 border-b text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {questions.length > 0 ? (
                  questions.map((question) => (
                    <tr key={question.id} className="text-center text-gray-200">
                      <td className="px-4 py-2 border-b">
                        {question.question}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {question.response}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <Button
                          onClick={() =>
                            Swal.fire({
                              title: "Detalles de la Pregunta",
                              text: `Pregunta: ${question.question}\nRespuesta: ${question.response}`,
                              icon: "info",
                            })
                          }
                          variant={"primary"}
                          type={"submit"}
                          label={"Ver Detalles"}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center px-4 py-2 border-b">
                      No hay preguntas disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="text-gray-300">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
          {/* Mostrar/Ocultar formulario de crear nueva pregunta */}
          <div className="mt-6">
            <Button
              onClick={() => setShowForm(!showForm)}
              variant={"primary"}
              label={showForm ? "Ocultar Formulario" : "Crear Pregunta"}
              type={"button"}
            />
            {showForm && (
              <div className="mt-4 p-4 border border-gray-600 rounded-lg">
                <h2 className="font-bold text-xl text-gray-200 mb-4">
                  Agregar Nueva Pregunta
                </h2>
                <div className="mb-4">
                  <label htmlFor="question" className="block text-gray-300">
                    Pregunta
                  </label>
                  <input
                    type="text"
                    id="question"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="mt-1 block w-full border-gray-500 rounded-md shadow-sm bg-gray-700 text-gray-300"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="response" className="block text-gray-300">
                    Respuesta
                  </label>
                  <textarea
                    id="response"
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    className="mt-1 block w-full border-gray-500 rounded-md shadow-sm bg-gray-700 text-gray-300"
                  />
                </div>
                <Button
                  onClick={handleCreateQuestion}
                  variant={"primary"}
                  label={"Agregar Pregunta"}
                  type={"button"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatBotPage;
