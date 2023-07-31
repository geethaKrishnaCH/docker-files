import { useEffect, useState } from "react";
import styles from "./App.module.css";
import axios from "axios";

function App() {
  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState(null);

  function handleInputChange(e) {
    setGoal(e.target.value);
  }

  async function handleAddGoal() {
    try {
      await axios.post("http://localhost:8080/goal", {
        description: goal,
      });
      setGoal("");
      setError(null);
      fetchGoals();
    } catch (err) {
      setError("Failed to add new goal");
    }
  }

  async function fetchGoals() {
    try {
      const res = await axios.get("http://localhost:8080/goal");
      setGoals(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch goals");
    }
  }
  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <>
      <div>{error && error}</div>
      <form className={styles["form-control"]}>
        <label htmlFor="goal">Add Goal</label>
        <input
          type="text"
          name="goal"
          id="goal"
          value={goal}
          onChange={handleInputChange}
        />
        <button onClick={handleAddGoal} type="button">
          Add
        </button>
      </form>
      <div className={styles["goals-list"]}>
        <ul>
          {goals.map((g) => (
            <li key={g._id}>{g.description}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
