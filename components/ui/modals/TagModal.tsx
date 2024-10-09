"use client";
import React, { FormEvent, useState } from 'react'
import Modal from './Modal'
import { useTagModal } from '@/hooks/modals/useTagModal';
import { ITag } from '@/interfaces/Itag';
import Form from '@/components/shared/Form/Form';
import FormInput from '@/components/shared/Form/FormInput';
import FormSelectInput from '@/components/shared/Form/selectElement/FormSelectInput';
import Button from '@/components/shared/Button/Button';

const TagModal = () => {
  const tagModal = useTagModal();
  const [formData, setFormData] = useState<ITag>({
    name: '',
    color: '',
    priority: "baja",
    category: ''
  });
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {

  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

  }
  const tagModalBody = (
    <Form onSubmit={handleSubmit}> 
      <FormInput 
        label='Nombre de etiqueta'
        name='name'
        idInput='name'
        value={formData.name}
        onChange={handleChange}
        type='text'
      />
      <FormInput 
        label='Color'
        name='color'
        idInput='color'
        value={formData.color}
        onChange={handleChange}
        type='color'
      />
      <FormSelectInput 
        label='Prioridad'
        selectName='priority'
        selectId='priority'
        value={formData.priority}
        onChange={handleChange}
        options={[
          { value: 'baja', name: 'Baja' },
          { value: 'media', name: 'Media' },
          { value: 'alta', name: 'Alta' }
        ]}
      />
      <div>
        <Button type='submit' variant='primary' label='Crear Etiqueta' />
      </div>

    </Form>
  )
  return (
    <Modal 
      isOpen={tagModal.isOpen}
      onClose={tagModal.onClose}
      title='Crear etiqueta'
      body={tagModalBody}

    />
  )
}

export default TagModal;