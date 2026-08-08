import RequestCard from './RequestCard.jsx';

function RequestList({ requests, onDeleteRequest }) {
  if (requests.length === 0) {
    return (
      <div className="request-list">
        <p>ไม่มีรายการคำร้อง</p>
      </div>
    );
  }

  return (
    <div className="request-list">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}

export default RequestList;