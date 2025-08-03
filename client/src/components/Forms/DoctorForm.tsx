import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Button } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { DoctorFormData, DoctorSchema } from '../../schemas';
import { Doctor } from '../../types';

interface DoctorFormProps {
  visible: boolean;
  doctor?: Doctor | null;
  onClose: () => void;
  onSubmit: (data: DoctorFormData) => void;
  loading?: boolean;
}

export const DoctorForm: React.FC<DoctorFormProps> = ({
  visible,
  doctor,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: DoctorFormData) => {
    try {
      DoctorSchema.parse(values);
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

  const specializations = [
    'Cardiology', 'Endocrinology', 'Pathology', 'Internal Medicine', 
    'Nephrology', 'Hepatology', 'Hematology', 'Oncology', 'Neurology',
    'Orthopedics', 'Dermatology', 'Psychiatry', 'Radiology', 'Surgery'
  ];

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <TeamOutlined className="text-green-600" />
          <span>{doctor ? 'Edit Doctor' : 'Add New Doctor'}</span>
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
        initialValues={doctor || {}}
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
            <Input placeholder="Dr. John Smith" />
          </Form.Item>

          <Form.Item
            label="Specialization"
            name="specialization"
            rules={[{ required: true, message: 'Specialization is required' }]}
          >
            <Select placeholder="Select specialization" showSearch>
              {specializations.map(spec => (
                <Select.Option key={spec} value={spec}>{spec}</Select.Option>
              ))}
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
            <Input placeholder="doctor@hospital.com" />
          </Form.Item>

          <Form.Item
            label="Hospital/Clinic"
            name="hospital"
            rules={[
              { required: true, message: 'Hospital name is required' },
              { min: 2, message: 'Hospital name must be at least 2 characters' }
            ]}
          >
            <Input placeholder="City General Hospital" />
          </Form.Item>

          <Form.Item
            label="Years of Experience"
            name="experience"
            rules={[
              { required: true, message: 'Experience is required' },
              { type: 'number', min: 0, max: 50, message: 'Experience must be between 0 and 50 years' }
            ]}
          >
            <InputNumber 
              placeholder="10" 
              className="w-full"
              min={0}
              max={50}
            />
          </Form.Item>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {doctor ? 'Update Doctor' : 'Add Doctor'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};