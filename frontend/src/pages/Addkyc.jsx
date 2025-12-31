import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Container, Alert, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Addkyc = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: '',
    dob: '',
    address: '',
    documenttype: 'Aadhar',
    documentnumber: '',
    photo: '',
    status: 'Pending'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const photoInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      const file = files && files[0];
      setForm(prev => ({ ...prev, photo: file }));
      if (file) setPreview(URL.createObjectURL(file));
      else setPreview('');
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('formData', JSON.stringify({
      fullname: form.fullname,
      dob: form.dob,
      address: form.address,
      documenttype: form.documenttype,
      documentnumber: form.documentnumber,
      status: form.status
    }));

    if (form.photo) {
      formData.append('photo', form.photo);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:6500/api/kyc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setSuccess('KYC record submitted successfully!');
      setTimeout(() => navigate('/view'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting KYC');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '120px 20px 40px', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <Container>
        <div className="animate-fade-in mx-auto" style={{ maxWidth: 800 }}>
          <div className="glass-card p-5">
            <h2 className="mb-4 text-gradient" style={{ fontWeight: 700 }}>KYC Enrollment</h2>
            <p className="text-secondary mb-5">Please provide your official details to complete the verification process.</p>

            {success && <Alert variant="success" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '1rem' }}>
              <i className="fas fa-check-circle me-2"></i> {success}
            </Alert>}
            {error && <Alert variant="danger" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '1rem' }}>
              <i className="fas fa-exclamation-circle me-2"></i> {error}
            </Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-secondary fw-500">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullname"
                      value={form.fullname}
                      onChange={handleChange}
                      required
                      placeholder="As per Government ID"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 16px', borderRadius: '0.8rem' }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-secondary fw-500">Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      required
                      max={new Date().toISOString().split('T')[0]}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 16px', borderRadius: '0.8rem' }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="text-secondary fw-500">Residential Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Street, City, Zip Code"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 16px', borderRadius: '0.8rem' }}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-secondary fw-500">Document Type</Form.Label>
                    <Form.Select
                      name="documenttype"
                      value={form.documenttype}
                      onChange={handleChange}
                      required
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 16px', borderRadius: '0.8rem' }}
                    >
                      <option value="Aadhar">Aadhar Card</option>
                      <option value="Pan">PAN Card</option>
                      <option value="Passport">Passport</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-secondary fw-500">Document Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="documentnumber"
                      value={form.documentnumber}
                      onChange={handleChange}
                      required
                      placeholder="Unique ID Number"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 16px', borderRadius: '0.8rem' }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-5">
                <Form.Label className="text-secondary fw-500">Photo Identity Proof</Form.Label>
                <div style={{
                  border: '2px dashed rgba(255,255,255,0.1)',
                  borderRadius: '1rem',
                  padding: '30px',
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.01)',
                  position: 'relative'
                }}>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}
                    ref={photoInputRef}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  />
                  {preview ? (
                    <img src={preview} alt="Preview" style={{ maxHeight: 150, borderRadius: '0.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
                  ) : (
                    <>
                      <i className="fas fa-cloud-upload-alt text-gradient mb-3" style={{ fontSize: '2.5rem' }}></i>
                      <div style={{ fontWeight: 500 }}>Click to upload or drag & drop</div>
                      <div className="text-secondary" style={{ fontSize: '0.8rem' }}>PNG, JPG or JPEG (Max 5MB)</div>
                    </>
                  )}
                </div>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-100 premium-gradient border-0 py-3"
                style={{ fontWeight: 700, fontSize: '1.1rem', borderRadius: '0.8rem', color: '#07090c' }}
              >
                {loading ? <><i className="fas fa-spinner fa-spin me-2"></i> Submitting...</> : "Submit Enrollment"}
              </Button>
            </Form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Addkyc;

