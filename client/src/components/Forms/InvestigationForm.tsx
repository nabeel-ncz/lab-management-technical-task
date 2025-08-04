import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, Typography, Card, Tag, Input } from 'antd';
import { FileTextOutlined, UserOutlined, TeamOutlined, ExperimentOutlined } from '@ant-design/icons';
import { InvestigationFormData, InvestigationSchema } from '../../schemas';
import { Patient, Doctor, Test } from '../../types';
import { api } from '../../api';

const { Text } = Typography;

interface InvestigationFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: InvestigationFormData, callAfterSuccess: () => void) => void;
  loading?: boolean;
}

export const InvestigationForm: React.FC<InvestigationFormProps> = ({
  visible,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTests, setSelectedTests] = useState<Test[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const [patientsData, doctorsData, testsData] = await Promise.all([
        api.getPatients(),
        api.getDoctors(),
        api.getTests()
      ]);
      setPatients(patientsData);
      setDoctors(doctorsData);
      setTests(testsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setDataLoading(false);
    }
  };


  const callAfterSuccess = () => {
    form.resetFields();
    setSelectedTests([]);
  }

  const handleSubmit = async (values: InvestigationFormData) => {
    try {
      InvestigationSchema.parse(values);
      onSubmit({
        ...values,
        totalAmount: calculateTotalAmount(),
        order: 1
      }, callAfterSuccess);
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setSelectedTests([]);
    onClose();
  };

  const handleTestsChange = (testIds: string[]) => {
    const selected = tests.filter(test => testIds.includes(test.id));
    setSelectedTests(selected);
  };

  const calculateTotalAmount = () => {
    return selectedTests.reduce((total, test) => total + test.price, 0);
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <FileTextOutlined className="text-blue-600" />
          <span>Create New Investigation</span>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            label={
              <div className="flex items-center space-x-2">
                <UserOutlined className="text-blue-600" />
                <span>Patient</span>
              </div>
            }
            name="patientId"
            rules={[{ required: true, message: 'Please select a patient' }]}
          >
            <Select
              placeholder="Search and select patient"
              showSearch
              loading={dataLoading}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={patients.map(patient => ({
                value: patient.id,
                label: `${patient.name} (${patient.age}Y, ${patient.gender})`,
              }))}
            />
          </Form.Item>

          <Form.Item
            label={
              <div className="flex items-center space-x-2">
                <TeamOutlined className="text-green-600" />
                <span>Doctor</span>
              </div>
            }
            name="doctorId"
            rules={[{ required: true, message: 'Please select a doctor' }]}
          >
            <Select
              placeholder="Search and select doctor"
              showSearch
              loading={dataLoading}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={doctors.map(doctor => ({
                value: doctor.id,
                label: `${doctor.name} - ${doctor.specialization}`,
              }))}
            />
          </Form.Item>
        </div>

        <Form.Item
          label={
            <div className="flex items-center space-x-2">
              <ExperimentOutlined className="text-purple-600" />
              <span>Lab Tests</span>
            </div>
          }
          name="testIds"
          rules={[{ required: true, message: 'Please select at least one test' }]}
        >
          <Select
            mode="multiple"
            placeholder="Search and select tests"
            showSearch
            loading={dataLoading}
            onChange={handleTestsChange}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={tests.map(test => ({
              value: test.id,
              label: `${test.name} - ₹${test.price} (${test.category})`,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Priority"
          name="priority"
          initialValue="Normal"
          rules={[{ required: true, message: 'Please select priority' }]}
        >
          <Select>
            <Select.Option value="Normal">Normal</Select.Option>
            <Select.Option value="High">High</Select.Option>
            <Select.Option value="Emergency">Emergency</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Additional Notes" name="notes">
          <Input.TextArea
            rows={3}
            placeholder="Any additional notes or special instructions..."
          />
        </Form.Item>

        {/* Selected Tests Summary */}
        {selectedTests.length > 0 && (
          <Card title="Selected Tests Summary" className="mb-4">
            <div className="space-y-3">
              {selectedTests.map(test => (
                <div key={test.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <Text className="font-medium">{test.name}</Text>
                    <div className="mt-1">
                      <Tag color="blue">{test.category}</Tag>
                    </div>
                  </div>
                  <Text className="font-bold text-green-600">₹{test.price}</Text>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <Text className="font-bold text-lg">Total Amount:</Text>
                <Text className="font-bold text-xl text-green-600">
                  ₹{calculateTotalAmount().toLocaleString()}
                </Text>
              </div>
            </div>
          </Card>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Investigation
          </Button>
        </div>
      </Form>
    </Modal>
  );
};