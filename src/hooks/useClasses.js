import { useState } from "react";
import axios from "axios";

export function useClasses(baseURL) {
  const videocallURL = import.meta.env.VITE_VIDEOCALL_URL;
  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseURL}/classes/list-classes`, {
        withCredentials: true,
      });
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      throw error;
    }
  };

  const createClass = async (payload) => {
    try {
      const response = await axios.post(`${baseURL}/classes/create-classes`, payload, {
        withCredentials: true,
      });
      await fetchClasses(); // Refresh the list
      return response.data;
    } catch (error) {
      console.error("Failed to create class:", error);
      throw error;
    }
  };

  const deleteClass = async (classId) => {
    try {
      await axios.delete(`${baseURL}/classes/delete-class/${classId}`, {
        withCredentials: true,
      });
      await fetchClasses(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete class:", error);
      throw error;
    }
  };

  const startClass = async (cls) => {
    try {
      if (cls.status?.toLowerCase() === 'live') {
        // Already live, no need to start
        return;
      }

      // Get a room token so the video-call server can verify we're really
      // this class's moderator before starting it.
      const tokenResponse = await axios.get(`${baseURL}/classes/room-token/${cls.access_code}`, {
        withCredentials: true,
      });
      const roomToken = tokenResponse.data.token;

      // Call the video-call service to start the class (change status to live)
      const response = await fetch(`${videocallURL}/classes/start-class/${cls.access_code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${roomToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to start class');
      }

      // Refresh classes to show updated status
      await fetchClasses();
    } catch (error) {
      console.error('Error starting class:', error);
      throw error;
    }
  };

  return {
    classes,
    fetchClasses,
    createClass,
    deleteClass,
    startClass
  };
}