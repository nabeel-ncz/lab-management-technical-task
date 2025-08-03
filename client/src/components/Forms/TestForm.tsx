import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Button } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import { TestFormData, TestSchema } from '../../schemas';
import { Test } from '../../types';

interface TestFormProps {
  visible: boolean;
  test?: Test | null;
  onClose: () => void;
  onSubmit: (data: TestFormData) => void;
  loading?: boolean;
}

export const TestForm: React.FC<TestFormProps> = ({
  visible,
  test,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: TestFormData) => {
    try {
      TestSchema.parse(values);
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

  const categories = [
    'Cardiology', 'Endocrinology', 'Hematology', 'Hepatology', 
    'Nephrology', 'Immunology', 'Microbiology', 'Biochemistry',
    'Pathology', 'Radiology', 'Oncology', 'Toxicology'
  ];

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <ExperimentOutlined className="text-purple-600" />
          <span>{test ? 'Edit Lab Test' : 'Add New Lab Test'}</span>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={test || {}}
        className="mt-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Test Name"
            name="name"
            rules={[
              { required: true, message: 'Test name is required' },
              { min: 2, message: 'Test name must be at least 2 characters' }
            ]}
          >
            <Input placeholder="Complete Blood Count" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Category is required' }]}
          >
            <Select placeholder="Select category" showSearch>
              {categories.map(cat => (
                <Select.Option key={cat} value={cat}>{cat}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Price (₹)"
            name="price"
            rules={[
              { required: true, message: 'Price is required' },
              { type: 'number', min: 1, message: 'Price must be greater than 0' }
            ]}
          >
            <InputNumber 
              placeholder="500" 
              className="w-full"
              min={1}
              formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/₹\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label="Normal Range"
            name="normalRange"
            rules={[
              { required: true, message: 'Normal range is required' },
              { min: 1, message: 'Normal range is required' }
            ]}
          >
            <Input placeholder="4.5-11.0 x10³/μL" />
          </Form.Item>
        </div>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: 'Description is required' },
            { min: 10, message: 'Description must be at least 10 characters' }
          ]}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Detailed description of what this test measures and its clinical significance" 
          />
        </Form.Item>

        <Form.Item
          label="Preparation Instructions"
          name="preparationInstructions"
          rules={[
            { required: true, message: 'Preparation instructions are required' },
            { min: 5, message: 'Preparation instructions must be at least 5 characters' }
          ]}
        >
          <Input.TextArea 
            rows={2} 
            placeholder="Instructions for patient preparation (e.g., fasting requirements, medication restrictions)" 
          />
        </Form.Item>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {test ? 'Update Test' : 'Add Test'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};