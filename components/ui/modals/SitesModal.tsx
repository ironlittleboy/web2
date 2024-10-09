"use client";
import axios from "axios";
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import useSitesModal from "@/hooks/modals/useSitesModal";
import { ChangeEvent, FormEvent, useState } from "react";
import Modal from "./Modal";
import { IoIosLocate } from "react-icons/io";
import Button from "@/components/shared/Button/Button";


const SiteModal = () => {
  const registerModal = useSitesModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    siteName: "",
    siteAddress: "",
    siteCity: "",
    siteCountry: "",
  });
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // setIsLoading(true);
    // axios.post("/api/sites", formData).then((response) => {}).catch((error) => {}).finally(() => {
    //   setIsLoading(false);
    //});
    console.log(formData);
    registerModal.onClose();
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const SitesModalBody = (
      <div>
        <Form onSubmit={handleSubmit}>
          <FormInput
            label="Nombre de la bodega"
            name="siteName"
            idInput="siteName"
            value={formData.siteName}
            onChange={handleChange}
            type="text"
          />
          <FormInput
            label="Dirección"
            name="siteAddress"
            idInput="siteAddress"
            value={formData.siteAddress}
            onChange={handleChange}
            type="text"
          />
          <FormInput
            label="Ciudad"
            name="siteCity"
            idInput="siteCity"
            value={formData.siteCity}
            onChange={handleChange}
            type="text"
          />
          <FormInput
            label="País"
            name="siteCountry"
            idInput="siteCountry"
            value={formData.siteCountry}
            onChange={handleChange}
            type="text"
          />
          <div className="w-full py-6">
            <Button type="submit" variant="primary" label="Agregar bodega" />
          </div>
        </Form>
      </div>
    );

  return (
    <Modal
      disabled={isLoading}
      title="Crear nueva bodega"
      isOpen={registerModal.isOpen}
      onClose={registerModal.onClose}
      onSubmit={handleSubmit}
      body={SitesModalBody}
      actionLabel="Crear"
    />
  );
};

export default SiteModal;
