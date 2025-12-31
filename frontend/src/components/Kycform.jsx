import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

const Kycform = ({ fetchkyc, editId, seteditId }) => {
  const [formData, setFormData] = useState({
    userId: '',
    fullName: '',
    dob: '',
    address: '',
    documentType: 'Aadhar',
    documentNumber: '',
    status: 'Pending' // Default status,
  });
  useEffect(() => {
    if (editId) {
      axios.get(`http://localhost:6500/api/kyc/${editId}`)
        .then((res) => setFormData({
          ...res.data,
          dob: res.data.dob ? res.data.dob.split('T')[0] : ''
        }))
        .catch(err => console.log(err));
    }
  }, [editId]);

  const hc = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const hs = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(formData).forEach(key => fd.append(key, formData[key]));

    try {
      if (editId) {
        await axios.put(`http://localhost:6500/api/kyc/${editId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormData({
          userId: '',
          fullName: '',
          dob: '',
          address: '',
          documentType: 'Aadhar',
          documentNumber: '',
          status: 'Pending' // Default status,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card className='mb-4 shadow sm'>
      <Card.Header>{editId ? 'Update Kyc' : 'Add Kyc'}</Card.Header>
      <Card.Body>
        <Form onSubmit={hs}>
          <Row className='g-3'>
            <Col md={6}><Form.Control name="fullName" placeholder='Full Name' value={formData.fullName} onChange={hc} required /></Col>
            <Col md={6}><Form.Control type="date" name="dob" placeholder='Date of Birth' value={formData.dob} onChange={hc} required /></Col>
            <Col md={6}><Form.Control name="address" placeholder='Address' value={formData.address} onChange={hc} required /></Col>
            <Col md={6}>
              <Form.Select name="documentType" value={formData.documentType} onChange={hc} required>
                <option value="Aadhar">Aadhar</option>
                <option value="PAN">PAN</option>
                <option value="Passport">Passport</option>
              </Form.Select>
            </Col>
            <Col md={6}><Form.Control name="documentNumber" placeholder='Document Number' value={formData.documentNumber} onChange={hc} required /></Col>
            <Col md={6}>
              <Form.Select name="status" value={formData.status} onChange={hc} required>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Col>
            <Col md={12}>
              <Button type="submit" variant='primary' className='w-100'>
                {editId ? 'Update KYC' : 'Add KYC'}
                </Button>'
            </Col>
          </Row>
        </Form>
        </Card.Body>
      </Card>
    );
  }

export default Kycform
