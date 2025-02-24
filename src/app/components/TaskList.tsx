 

import React, { useEffect, useState } from "react";
import { fetchUserTasks } from "../utils/camundaApi";

interface TaskListProps {
  userId: string;
}

const TaskList: React.FC<TaskListProps> = ({ userId }) => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchUserTasks(userId).then(setTasks);
  }, [userId]);

  return (
    <div>
      <h3 className="text-lg font-bold">Your Requests:</h3>
      <ul className="list-disc ml-4">
        {tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
