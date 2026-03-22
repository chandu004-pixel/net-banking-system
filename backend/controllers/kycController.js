// controllers/kycController.js
const fs = require('fs');
const path = require('path');
const KYC = require('../models/kyc');

const uploadsDir = path.join(__dirname, '..', 'uploads'); // adjust if your uploads folder is elsewhere

const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'ignore_missing_if_not_used', 
});

// helper to safely convert image to base64
function getBase64Image(filename) {
  try {
    const fp = path.join(uploadsDir, filename);
    const bitmap = fs.readFileSync(fp);
    return Buffer.from(bitmap).toString('base64');
  } catch (err) {
    console.error('Error reading file:', filename, err);
    return null;
  }
}

function getMimeType(filename) {
  if (!filename) return 'image/jpeg';
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'image/jpeg';
}

// helper: remove file if exists
function removeFileIfExists(filename) {
  if (!filename) return;
  const fp = path.join(uploadsDir, filename);
  fs.access(fp, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(fp, (unlinkErr) => {
        if (unlinkErr) console.warn('Failed to remove file', fp, unlinkErr);
      });
    }
  });
}

// CREATE
exports.addKYC = async (req, res) => {
  try {
    console.log('addKYC Request Body:', req.body);
    console.log('addKYC Request Files:', req.files);
    const payload = req.body.formData ? (typeof req.body.formData === 'string' ? JSON.parse(req.body.formData) : req.body.formData) : req.body;

    // Normalize field names
    const fullname = payload.fullname || payload.fullName;
    const documenttype = payload.documenttype || payload.documentType;
    const documentnumber = payload.documentnumber || payload.documentNumber;
    const dob = payload.dob;
    const address = payload.address;

    console.log('Normalized Payload:', { fullname, dob, address, documenttype, documentnumber });

    if (!fullname || !dob || !address || !documenttype || !documentnumber) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    payload.fullname = fullname;
    payload.documenttype = documenttype;
    payload.documentnumber = documentnumber;

    // Cast dob to Date
    payload.dob = new Date(payload.dob);

    // Associate with user
    payload.user = req.user.userId;

    // Handle files if uploaded via multer upload.fields
    if (req.files) {
      if (req.files.idFile) payload.idFile = req.files.idFile[0].filename;
      if (req.files.addressFile) payload.addressFile = req.files.addressFile[0].filename;
    }

    const kyc = new KYC(payload);

    // 👇 Claude AI-Powered Automated KYC
    console.log('--- CLAUDE AI KYC ENGINE ACTIVE ---');
    if (payload.idFile && payload.addressFile && process.env.ANTHROPIC_API_KEY) {
        try {
            const idBase64 = getBase64Image(payload.idFile);
            const idMime = getMimeType(payload.idFile);
            const addressBase64 = getBase64Image(payload.addressFile);
            const addressMime = getMimeType(payload.addressFile);

            if (idBase64 && addressBase64) {
                const response = await anthropic.messages.create({
                    model: "claude-3-5-sonnet-20241022",
                    max_tokens: 1024,
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: `Please perform KYC verification. 
The user claims:
Name: ${payload.fullname}
DOB: ${payload.dob}
Address: ${payload.address}
Document Type: ${payload.documenttype}
Document Number: ${payload.documentnumber}

Analyze the attached ID document and Address proof. Tell me if the text on the document matches these details. 
Return ONLY a valid JSON object starting and ending with curly braces: {"verified": true|false, "reason": "string"}` },
                                { type: "image", source: { type: "base64", media_type: idMime, data: idBase64 } },
                                { type: "image", source: { type: "base64", media_type: addressMime, data: addressBase64 } }
                            ]
                        }
                    ]
                });

                const aiText = response.content[0].text;
                let aiDecision = { verified: false, reason: "Failed to parse AI response" };
                try {
                    const jsonStr = aiText.substring(aiText.indexOf('{'), aiText.lastIndexOf('}') + 1);
                    aiDecision = JSON.parse(jsonStr);
                } catch (e) {
                    console.error("Parse error on Claude response:", aiText);
                }

                if (aiDecision.verified) {
                    kyc.status = 'Verified';
                    console.log('Claude AI Decision: AUTO-VERIFIED');
                } else {
                    kyc.status = 'Pending';
                    console.log('Claude AI Decision: REQUIRES MANUAL REVIEW. Reason:', aiDecision.reason);
                }
            } else {
                kyc.status = 'Pending';
            }
        } catch (aiErr) {
            console.error('Claude AI Error:', aiErr);
            kyc.status = 'Pending';
        }
    } else {
        kyc.status = 'Pending';
        console.log('Skipping AI verification: missing files or ANTHROPIC_API_KEY');
    }

    await kyc.save();
    res.status(201).json({ success: true, message: kyc.status === 'Verified' ? 'AI Auto-Verified Success' : 'KYC submitted for review', data: kyc });
  } catch (err) {
    console.error('addKYC error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};


// READ ALL
exports.getAllKYC = async (req, res) => {
  try {
    const data = await KYC.find().sort({ createdAt: -1 });
    console.log(`getAllKYC: Found ${data.length} records`);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('getAllKYC error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// READ PERSONAL
exports.getMyKyc = async (req, res) => {
  try {
    const kyc = await KYC.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: kyc });
  } catch (err) {
    console.error('getMyKyc error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// READ ONE
exports.getKYCById = async (req, res) => {
  try {
    const kyc = await KYC.findById(req.params.id);
    if (!kyc) return res.status(404).json({ success: false, error: 'KYC not found' });
    res.status(200).json({ success: true, data: kyc });
  } catch (err) {
    console.error('getKYCById error:', err);
    res.status(400).json({ success: false, error: 'Invalid id' });
  }
};

exports.updateKYC = async (req, res) => {
  try {

    // 👇 Extract uploaded files (if any)
    const idFile = req.files?.idFile?.[0]?.filename;
    const addressFile = req.files?.addressFile?.[0]?.filename;

    // 👇 Build updated data object
    const updatedData = {
      ...req.body,
    };

    // 👇 Only add file fields if they exist
    if (idFile) {
      updatedData.idFile = idFile;
    }

    if (addressFile) {
      updatedData.addressFile = addressFile;
    }

    // 👇 Update in DB
    const updatedKyc = await KYC.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedKyc);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// DELETE
exports.deleteKYC = async (req, res) => {
  try {
    const deleted = await KYC.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'KYC not found' });

    // remove photo file if present
    if (deleted.photo) removeFileIfExists(deleted.photo);

    res.status(200).json({ success: true, message: 'KYC deleted' });
  } catch (err) {
    console.error('deleteKYC error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};