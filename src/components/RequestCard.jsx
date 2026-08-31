import { Link } from 'react-router-dom';
import PriorityBadge from './PriorityBadge.jsx';

function RequestCard({
  request,
  onDeleteRequest,
  onMarkDone,
}) {
  return (
    <article className="request-card">
      <div>
        <p className="request-id">{request.id}</p>

        <h3>
          <Link to={`/requests/${request.id}`}>
            {request.requestType}
          </Link>
        </h3>

        <p>{request.location}</p>
        <p>{request.details}</p>

        <p>
          <span className={`badge ${request.status}`}>
            {request.status}
          </span>{' '}
          <PriorityBadge priority={request.priority} />
        </p>
      </div>

<div
  style={{
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
    alignItems: 'center',
  }}
>
  <button
    className="button danger"
    type="button"
    onClick={() => onDeleteRequest(request.id)}
    aria-label={`ลบคำร้อง ${request.id}`}
    style={{
      width: '100px',
      height: '40px',
    }}
  >
    ลบ
  </button>

  {request.status !== 'completed' ? (
    <button
      className="button primary"
      type="button"
      onClick={() => onMarkDone(request.id)}
      style={{
        width: '100px',
        height: '40px',
      }}
    >
      ทำเสร็จ
    </button>
  ) : (
    <div
      style={{
        width: '100px',
        height: '40px',
      }}
    />
  )}
</div>
    </article>
  );
}

export default RequestCard;