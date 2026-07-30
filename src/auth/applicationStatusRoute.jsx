import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Gates a route behind having an actual application on file — used for the
// curriculum/fee-schedule quick links so they aren't just open pages anyone
// can hit directly without ever applying.
export default function ApplicationStatusRoute({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(`${baseURL}/students/application-status`, {
          credentials: "include",
        });

        if (response.status === 401) {
          navigate("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          navigate("/login");
          return;
        }

        if (!data.has_applied) {
          navigate("/form");
          return;
        }

        setAllowed(true);
      } catch (err) {
        navigate("/login");
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, [navigate]);

  if (checking) return <p className="text-center mt-20">🔐 Verifying access...</p>;

  return allowed ? children : null;
}
