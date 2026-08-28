import { useEffect, useState } from "react";
import { getRequests } from "../services/requestService";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

function DashboardPage() {
  const [loadState, setLoadState] = useState("loading");
  const [requests, setRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoadState("loading");

        const data = await getRequests();

        setRequests(data);
        setLoadState("success");
      } catch (error) {
        setErrorMessage(error.message);
        setLoadState("error");
      }
    }

    loadData();
  }, []);

  if (loadState === "loading") {
    return <LoadingState />;
  }

  if (loadState === "error") {
    return <ErrorState message={errorMessage} />;
  }

  if (loadState === "success" && requests.length === 0) {
    return (
      <div data-testid="empty-state">
        ยังไม่มีคำร้อง
      </div>
    );
  }

  return (
    <section data-testid="page-dashboard">
      <h1>Dashboard</h1>
      <p>จำนวนคำร้อง {requests.length}</p>
    </section>
  );
}

export default DashboardPage;