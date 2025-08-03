import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { PatientFormData, PatientSchema } from '../../schemas';
import { Patient } from '../../types';

interface PatientFormProps {
  visible: boolean;
  patient?: Patient | null;
  onClose: () => void;
  onSubmit: (data: PatientFormData) => void;
  loading?: boolean;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  visible,
  patient,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: PatientFormData) => {
    try {
      PatientSchema.parse(values);
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <UserOutlined className="text-blue-600" />
          <span>{patient ? 'Edit Patient' : 'Add New Patient'}</span>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={patient || {}}
        className="mt-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: 'Name is required' },
              { min: 2, message: 'Name must be at least 2 characters' }
            ]}
          >
            <Input placeholder="Enter patient name" />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[
              { required: true, message: 'Age is required' },
              { type: 'number', min: 1, max: 120, message: 'Age must be between 1 and 120' }
            ]}
          >
            <InputNumber 
              placeholder="Enter age" 
              className="w-full"
              min={1}
              max={120}
            />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Gender is required' }]}
          >
            <Select placeholder="Select gender">
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: 'Phone number is required' },
              { min: 10, message: 'Phone number must be at least 10 digits' }
            ]}
          >
            <Input placeholder="+91 9876543210" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Invalid email format' }
            ]}
          >
            <Input placeholder="patient@email.com" />
          </Form.Item>

          <Form.Item
            label="Emergency Contact"
            name="emergencyContact"
            rules={[
              { required: true, message: 'Emergency contact is required' },
              { min: 10, message: 'Emergency contact must be at least 10 digits' }
            ]}
          >
            <Input placeholder="+91 9876543210" />
          </Form.Item>
        </div>

        <Form.Item
          label="Address"
          name="address"
          rules={[
            { required: true, message: 'Address is required' },
            { min: 5, message: 'Address must be at least 5 characters' }
          ]}
        >
          <Input.TextArea rows={3} placeholder="Enter complete address" />
        </Form.Item>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {patient ? 'Update Patient' : 'Add Patient'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};