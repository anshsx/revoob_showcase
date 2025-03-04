import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const Widget = ({ projectId }) => {
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
    <div className="p-5 border border-gray-300 rounded-lg w-80 bg-white shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Feedbacks</h3>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-gray-500 text-sm">No feedbacks found.</p>
      ) : (
        <ul className="space-y-3">
          {feedbacks.map((feedback) => (
            <li key={feedback.id} className="p-3 border rounded-md shadow-sm bg-gray-50">
              <strong className="text-gray-700">
                {feedback.user_name} <span className="text-yellow-500">({feedback.rating}⭐)</span>
              </strong>
              <p className="text-gray-600 text-sm mt-1">{feedback.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
