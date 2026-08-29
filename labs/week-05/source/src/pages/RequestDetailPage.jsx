import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRequestById } from "../services/requestService";

function RequestDetailPage() {
  const { requestId } = useParams();

  const [request, setRequest] = useState(null);

  useEffect(() => {
    async function loadRequest() {
      const data = await getRequestById(requestId);
      setRequest(data);
    }

    loadRequest();
  }, [requestId]);

  if (!request) {
    return (
      <section data-testid="page-request-detail">
        <h1>ไม่พบคำร้อง</h1>
        <p>ไม่พบคำร้องรหัส {requestId}</p>
        <Link to="/">กลับหน้าหลัก</Link>
      </section>
    );
  }

  return (
    <section data-testid="page-request-detail">
      <h1>{request.title}</h1>
      <p>รหัส: {request.id}</p>
      <p>สถานะ: {request.status}</p>
    </section>
  );
}

export default RequestDetailPage;