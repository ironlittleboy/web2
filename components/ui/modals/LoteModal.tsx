"use client";
import React, { useState } from 'react'
import Modal from './Modal'
import { useLoteModal } from '@/hooks/modals/useLoteModal';
import Form from '@/components/shared/Form/Form';
import { ILote } from '@/interfaces/ILote';
import FormInput from '@/components/shared/Form/FormInput';
import FormCheckbox from '@/components/shared/Form/FormCheckbox';
import Button from '@/components/shared/Button/Button';

const LoteModal = () => {
  const loteModal = useLoteModal();
  const [formData, setFormData] = useState<ILote>({
    loteCode: '',
    expirationDate: '',
    isExpirable: false,
    manufactoringDate: '',
    productId: 0,
    providerId: 0,
    quantity: 0
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as | HTMLInputElement | HTMLSelectElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : false;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const LoteModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput 
        idInput='loteCode'
        label='Codigo de lote'
        name='loteCode'
        onChange={handleChange}
        type='text'
        value={formData.loteCode}
      />
      <FormInput 
        idInput='expirationDate'
        label='Fecha de expiracion'
        name='expirationDate'
        onChange={handleChange}
        type='date'
        value={formData.expirationDate}
      />
      <FormInput 
        idInput='manufactoringDate'
        label='Fecha de fabricacion'
        name='manufactoringDate'
        onChange={handleChange}
        type='date'
        value={formData.manufactoringDate}
      />
      <FormInput 
        idInput='quantity'
        label='Cantidad'
        name='quantity'
        onChange={handleChange}
        type='number'
        value={formData.quantity}
      />
      <FormCheckbox 
        checked={formData.isExpirable}
        label='Es expirable'
        onChange={handleChange}
        idCheckbox='isExpirable'
        key={formData.isExpirable.toString()}
        nameCheckbox='isExpirable'
      />
      {formData.isExpirable && (
        <FormInput 
          idInput='expirationDate'
          label='Fecha de expiracion'
          name='expirationDate'
          onChange={handleChange}
          type='date'
          value={formData.expirationDate}
        />
      )}
      <div>
        <Button variant='primary' label='Crear lote' type='submit'/>
      </div>
    </Form>
  );

  return (
    <Modal 
      title='Crear lote'  
      isOpen={loteModal.isOpen}
      onClose={loteModal.onClose}
      body={LoteModalBody}
    />
  );
}

export default LoteModal