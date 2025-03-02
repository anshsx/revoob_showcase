import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Widget = ({ projectId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!projectId) return;

      const { data, error } = await supabase
        .from("Feedback")
        .select("id, user_name, user_email, message, rating")
        .eq("project_id", projectId);

      if (error) {
        console.error("Error fetching feedbacks:", error);
      } else {
        setFeedbacks(data);
      }
      setLoading(false);
    };

    fetchFeedbacks();
  }, [projectId]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", width: "300px" }}>
      <h3>Feedbacks</h3>
      {loading ? (
        <p>Loading...</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedbacks found.</p>
      ) : (
        <ul>
          {feedbacks.map((feedback) => (
            <li key={feedback.id}>
              <strong>{feedback.user_name} ({feedback.rating}⭐)</strong>
              <p>{feedback.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Widget;
