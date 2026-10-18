import { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateRequestStatus } from '../services/requestService'; 

function RequestCard({ request: initialRequest, onDeleteRequest }) {
  const [request, setRequest] = useState(initialRequest);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  async function handleChangeStatus(nextStatus) {
    setUpdating(true);
    setError(null);
    try {
      const updated = await updateRequestStatus(request.id, nextStatus);
      setRequest(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <article className="request-card">
      <div>
        <p className="request-id">{request.id}</p>
        <h3>
          <Link to={`/requests/${request.id}`}>{request.requestType}</Link>
        </h3>
        <p>{request.location}</p>
        <p>{request.details}</p>
        <p>
          <span className={`badge ${request.status}`}>{request.status}</span> · {request.priority}
        </p>

        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

        <div className="status-actions" style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
          {request.status !== 'pending' && (
            <button
              className="button secondary"
              type="button"
              disabled={updating}
              onClick={() => handleChangeStatus('pending')}
            >
              Pending
            </button>
          )}
          {request.status !== 'in-progress' && (
            <button
              className="button secondary"
              type="button"
              disabled={updating}
              onClick={() => handleChangeStatus('in-progress')}
            >
              In Progress
            </button>
          )}
          {request.status !== 'completed' && (
            <button
              className="button secondary"
              type="button"
              disabled={updating}
              onClick={() => handleChangeStatus('completed')}
            >
              Completed
            </button>
          )}
        </div>
      </div>

      <button
        className="button danger"
        type="button"
        disabled={updating}
        onClick={() => onDeleteRequest(request.id)}
        aria-label={`ลบคำร้อง ${request.id}`}
      >
        ลบ
      </button>
    </article>
  );
}

export default RequestCard;