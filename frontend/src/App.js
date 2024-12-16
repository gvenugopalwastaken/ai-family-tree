import React, { useEffect, useState } from "react";
import FamilyTree from "./components/FamilyTree";

function App() {
  const [familyTree, setFamilyTree] = useState({ persons: [], relationships: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5001/family-tree");
        if (!response.ok) {
          throw new Error("Failed to fetch data from the backend.");
        }
        const data = await response.json();
        console.log("Fetched data:", data); // Log the fetched data
        setFamilyTree(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading Family Tree...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>AI Family Tree</h1>
      <FamilyTree persons={familyTree.persons} relationships={familyTree.relationships} />
    </div>
  );
}

export default App;
