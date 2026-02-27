import { useLocation } from 'react-router-dom';
import Kycform from '../components/Kycform';

const Addkyc = () => {
  const location = useLocation();
  const editId = location.state?.id;

  return (
    <div>
      <Kycform editId={editId} />
    </div>
  );
};

export default Addkyc;
