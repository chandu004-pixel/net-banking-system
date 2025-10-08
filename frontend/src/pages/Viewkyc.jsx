// src/pages/ViewKyc.js
import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert} from 'react-bootstrap';
import axios from 'axios';
import KycForm from '../components/Kycform';
import KycList from '../components/Kyclist';


function ViewKyc() {
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 


  

  const fetchKyc = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:6500/api/kyc');
      // Accept both [] and { data: [] } shapes
      const payload = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
      setList(payload);
    } catch (err) {
      console.error('fetchKyc error', err);
      setError('Failed to load KYC records. Check server or network.');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKyc();
    // no cleanup required here
  }, []);

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">KYC with Photo</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <KycForm fetchKyc={fetchKyc} editId={editId} setEditId={setEditId} />

      {loading ? (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <KycList data={list} fetchKyc={fetchKyc} setEditId={setEditId} />
      )}
    </Container>
  );
}

export default ViewKyc;