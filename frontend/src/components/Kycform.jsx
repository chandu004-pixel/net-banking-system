import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const Kycform = ({ fetchkyc, editId, seteditId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    dob: "",
    address: "",
    documenttype: "Aadhar",
    documentnumber: "",
    status: "Pending",
  });

  const [step, setStep] = useState(1);
  const [idFile, setIdFile] = useState(null);
  const [addressFile, setAddressFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editId) {
      api
        .get(`/kyc/${editId}`)
        .then((res) => {
          // res.data.data because the backend wraps it in { success: true, data: ... }
          const kycData = res.data.data || res.data;
          setFormData({
            fullname: kycData.fullname || "",
            dob: kycData.dob ? kycData.dob.split("T")[0] : "",
            address: kycData.address || "",
            documenttype: kycData.documenttype || "Aadhar",
            documentnumber: kycData.documentnumber || "",
            status: kycData.status || "Pending",
          });
        })
        .catch((err) => console.log(err));
    }
  }, [editId]);

  const hc = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const hs = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    // Use the keys the backend expects (fullname, documenttype, etc.)
    Object.keys(formData).forEach((key) =>
      fd.append(key, formData[key])
    );

    if (idFile) {
      fd.append("idFile", idFile);
    }
    if (addressFile) {
      fd.append("addressFile", addressFile);
    }

    try {
      if (editId) {
        await api.put(`/kyc/${editId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/kyc", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (fetchkyc) fetchkyc();
      if (seteditId) seteditId(null);

      // Navigate to repository directly for immediate feedback
      navigate("/view");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Error submitting KYC");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg-dashboard)' }}>
      <div className="w-full max-w-6xl rounded-3xl shadow-2xl flex overflow-hidden saas-card" style={{ background: 'var(--surface-primary)', border: '1px solid var(--card-border)' }}>
        {/* LEFT SIDE */}
        <div className="w-1/3 p-8" style={{ background: 'var(--surface-secondary)', borderRight: '1px solid var(--card-border)' }}>
          <button onClick={() => navigate('/dashboard')} className="transition flex items-center gap-2 mb-8 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <h2 className="text-xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
            KYC Verification
          </h2>

          <div className="space-y-4">
            {[
              "Personal Details",
              "Upload ID",
              "Address Proof",
              "Review & Submit",
            ].map((label, index) => (
              <div
                key={index}
                onClick={() => setStep(index + 1)}
                className={`p-4 rounded-xl cursor-pointer transition font-semibold ${step === index + 1
                  ? "bg-emerald-500 text-white shadow-lg"
                  : ""
                  }`}
                style={step !== index + 1 ? { background: 'var(--surface-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' } : {}}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-2/3 p-10">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Personal Details
              </h3>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    name="fullname"
                    placeholder="Full Name"
                    value={formData.fullname}
                    onChange={hc}
                    required
                    className="w-full rounded-xl px-4 py-3 focus:border-emerald-400 focus:outline-none font-medium"
                    style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
                  />

                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={hc}
                    required
                    className="w-full rounded-xl px-4 py-3 focus:border-emerald-400 focus:outline-none font-medium"
                    style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
                  />
                </div>

                <input
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={hc}
                  required
                  className="w-full rounded-xl px-4 py-3 focus:border-emerald-400 focus:outline-none font-medium"
                  style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <select
                    name="documenttype"
                    value={formData.documenttype}
                    onChange={hc}
                    required
                    className="w-full rounded-xl px-4 py-3 focus:border-emerald-400 focus:outline-none font-medium"
                    style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
                  >
                    <option value="Aadhar">Aadhar</option>
                    <option value="Pan">PAN</option>
                    <option value="Passport">Passport</option>
                  </select>

                  <input
                    name="documentnumber"
                    placeholder="Document Number"
                    value={formData.documentnumber}
                    onChange={hc}
                    required
                    className="w-full rounded-xl px-4 py-3 focus:border-emerald-400 focus:outline-none font-medium"
                    style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-xl transition font-bold"
                  style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
                >
                  Next Step
                </button>
              </div>
            </>
          )}

          {/* STEP 2 - UPLOAD ID */}
          {step === 2 && (
            <>
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Upload Government ID
              </h3>

              <div
                className="border-2 border-dashed hover:border-emerald-400 rounded-2xl p-10 text-center transition cursor-pointer"
                onClick={() => document.getElementById("idUpload").click()}
                style={{ background: 'var(--surface-tertiary)', border: '2px dashed var(--card-border)' }}
              >
                <input
                  type="file"
                  id="idUpload"
                  accept="image/png, image/jpeg"
                  hidden
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setIdFile(e.target.files[0]);
                    }
                  }}
                />

                {!idFile ? (
                  <div style={{ color: 'var(--text-muted)' }}>
                    <p className="text-lg mb-2">📄 Upload your ID</p>
                    <p className="text-sm">
                      Click to upload (PNG, JPG - Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={URL.createObjectURL(idFile)}
                      alt="preview"
                      className="h-40 rounded-xl object-cover"
                    />
                    <p className="text-emerald-400 text-sm">{idFile.name}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIdFile(null);
                      }}
                      className="text-red-400 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full mt-6 py-3 rounded-xl transition font-bold"
                style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
              >
                Next Step
              </button>
            </>
          )}

          {/* STEP 3 - ADDRESS PROOF */}
          {step === 3 && (
            <>
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Upload Address Proof
              </h3>

              <div
                className="border-2 border-dashed hover:border-emerald-400 rounded-2xl p-10 text-center transition cursor-pointer"
                onClick={() => document.getElementById("addressUpload").click()}
                style={{ background: 'var(--surface-tertiary)', border: '2px dashed var(--card-border)' }}
              >
                <input
                  type="file"
                  id="addressUpload"
                  accept="image/png, image/jpeg, application/pdf"
                  hidden
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setAddressFile(e.target.files[0]);
                    }
                  }}
                />

                {!addressFile ? (
                  <div style={{ color: 'var(--text-muted)' }}>
                    <p className="text-lg mb-2">🏠 Upload Address Proof</p>
                    <p className="text-sm">PNG, JPG or PDF (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    {addressFile.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(addressFile)}
                        alt="preview"
                        className="h-40 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="bg-emerald-400/10 px-6 py-4 rounded-xl text-emerald-400">
                        📄 PDF Uploaded
                      </div>
                    )}
                    <p className="text-emerald-400 text-sm">
                      {addressFile.name}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAddressFile(null);
                      }}
                      className="text-red-400 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(4)}
                className="w-full mt-6 py-3 rounded-xl transition font-bold"
                style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
              >
                Review Details
              </button>
            </>
          )}

          {/* STEP 4 - REVIEW */}
          {step === 4 && (
            <div style={{ color: 'var(--text-primary)' }}>
              <h3 className="text-2xl font-bold mb-6">Review & Submit</h3>
              <div className="p-6 rounded-2xl space-y-4" style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--card-border)' }}>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p style={{ color: 'var(--text-muted)' }}>Full Name</p>
                    <p className="font-bold">
                      {formData.fullname || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-muted)' }}>Date of Birth</p>
                    <p className="font-bold">
                      {formData.dob || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-muted)' }}>Address</p>
                    <p className="font-bold">
                      {formData.address || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-muted)' }}>Document</p>
                    <p className="font-bold">
                      {formData.documenttype} -{" "}
                      {formData.documentnumber || "No #"}
                    </p>
                  </div>
                </div>

                <div className="pt-4" style={{ borderTop: '1px solid var(--card-border)' }}>
                  <button
                    onClick={hs}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition shadow-xl disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Final Submission"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kycform;