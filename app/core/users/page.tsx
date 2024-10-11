"use client";

import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState } from "react";
import { IUser } from "@/interfaces/IUser";
import Button from "@/components/shared/Button/Button";
import { useFetch } from "@/hooks/useFetch";
import Label from "@/components/ui/label/Label";
import UserModal from "@/components/ui/modals/UserModal";
import useUserModal from "@/hooks/modals/useUserModal";

const Page = () => {
  const userModal = useUserModal();
  const [formData, setFormData] = useState<IUser>({
    name: "",
    email: "",
    cellphone: "",
    role: "user",
    identity: "",
    lastname: "",
  });

  const {
    data: userData,
    error: userError,
    loading: userLoading,
  } = useFetch({
    url: "/api/users",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="flex justify-center items-start w-full">
      <LateralNavbar />
      <div className="w-full flex flex-col justify-start items-center min-h-[calc(90vh-80px)] p-4">
        {userLoading && <Label type="info" text="Cargando usuarios" />}
        {userError && <Label type="error" text="Error al cargar usuarios" />}
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de usuarios</h1>
        </div>
        <div className="flex items-start justify-start">
          <Button
            type="button"
            onClick={userModal.onOpen}
            variant="primary"
            label="Crear usuario"
          />
        </div>
        <UserModal />
      </div>
    </main>
  );
};
export default Page;
