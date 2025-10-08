// src/components/KycForm.js
import React, { useEffect, useState } from 'react';
import { Card, Form, Row, Col, Button, Image, Spinner } from 'react-bootstrap';
import axios from 'axios';

const KycForm = ({ fetchKyc, editId, setEditId }) => {
  const [form, setForm] = useState({
    fullname: '',
    dob: '',
    address: '',
    documenttype: 'Aadhar',
    documentnumber: '',
    status: 'Pending'
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false); // submit state

  // load data for editId (supports two response shapes: res.data or res.data.data)
  useEffect(() => {
    let mounted = true;
    if (editId) {
      setLoading(true);
      axios.get(`http://localhost:6500/api/kyc/${editId}`)
        .then(res => {
          if (!mounted) return;
          const payload = res.data?.data ?? res.data; // accept {data:...} or direct object
          const d = payload || {};
          setForm({
            fullname: d.fullname || '',
            dob: d.dob ? d.dob.split('T')[0] : '',
            address: d.address || '',
            documenttype: d.documenttype || 'Aadhar',
            documentnumber: d.documentnumber || '',
            status: d.status || 'Pending'
          });
          setPreview(d.photo ? `http://localhost:6500/uploads/${d.photo}` : null);
          setFile(null);
        })
        .catch(err => {
          console.error('Load single error', err);
          alert('Failed to load record for editing');
        })
        .finally(() => { if (mounted) setLoading(false); });
    } else {
      // clear form when not editing
      setForm({ fullname:'', dob:'', address:'', documenttype:'Aadhar', documentnumber:'', status:'Pending' });
      setFile(null);
      setPreview(null);
    }

    return () => { mounted = false; };
  }, [editId]);

  // revoke object URL on unmount / when preview changes to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onFile = e => {
    const f = e.target.files?.[0] ?? null;
    // revoke previous blob preview if it was a blob
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!form.fullname || !form.dob || !form.address || !form.documentnumber) {
      alert('Please fill required fields: Name, DOB, Address, Document Number');
      return;
    }

    const fd = new FormData();
    Object.keys(form).forEach(k => fd.append(k, form[k]));
    // append file only if user chose one (so update without new photo keeps existing photo)
    if (file) fd.append('photo', file);

    try {
      setLoading(true);

      if (editId) {
        // PUT with FormData — DO NOT set Content-Type header manually
        await axios.put(`http://localhost:6500/api/kyc/${editId}`, fd);
        setEditId(null);
      } else {
        await axios.post('http://localhost:6500/api/kyc', fd);
      }

      // reset local form state
      setForm({ fullname:'', dob:'', address:'', documenttype:'Aadhar', documentnumber:'', status:'Pending' });
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
      setFile(null);
      setPreview(null);

      // refresh list
      fetchKyc();
    } catch (err) {
      console.error('Save error', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header>{editId ? 'Update KYC' : 'Add KYC'}</Card.Header>
      <Card.Body>
        <Form onSubmit={onSubmit}>
          <Row className="g-3">
            <Col md={3}>
              <Form.Control
                name="fullname"
                placeholder="Full name"
                value={form.fullname}
                onChange={onChange}
                required
              />
            </Col>

            <Col md={2}>
              <Form.Control
                name="dob"
                type="date"
                value={form.dob}
                onChange={onChange}
                required
              />
            </Col>

            <Col md={4}>
              <Form.Control
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={onChange}
                required
              />
            </Col>

            <Col md={3}>
              <Form.Select name="documenttype" value={form.documenttype} onChange={onChange}>
                <option>Aadhar</option>
                <option>PAN</option>
                <option>Passport</option>
              </Form.Select>
            </Col>

            <Col md={3}>
              <Form.Control
                name="documentnumber"
                placeholder="Document number"
                value={form.documentnumber}
                onChange={onChange}
                required
              />
            </Col>

            <Col md={3}>
              <Form.Select name="status" value={form.status} onChange={onChange}>
                <option>Pending</option>
                <option>Verified</option>
                <option>Rejected</option>
              </Form.Select>
            </Col>

            <Col md={3}>
              <Form.Control type="file" accept="image/*" onChange={onFile} />
            </Col>

            <Col md={3} className="d-grid">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <><Spinner animation="border" size="sm" /> Saving...</> : (editId ? 'Update' : 'Add')}
              </Button>
            </Col>

            <Col md={12}>
              {preview && (
                <div className="mt-3">
                  <strong>Preview:</strong>
                  <div>
                    <Image src={preview} thumbnail style={{ maxWidth: 200 }} />
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default KycForm;