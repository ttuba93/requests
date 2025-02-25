import { useEffect, useState } from "react";
import { Steps, Spin } from "antd";
import { fetchActiveTasks } from "../utils/camundaApi"; // API-функция

const { Step } = Steps;

interface StudentProcessStepsProps {
  processInstanceId: string;
}

const StudentProcessSteps: React.FC<StudentProcessStepsProps> = ({ processInstanceId }) => {
  const [activeTasks, setActiveTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const tasks = await fetchActiveTasks(processInstanceId);
        setActiveTasks(tasks);
      } catch (error) {
        console.error("Ошибка загрузки задач:", error);
      }
      setLoading(false);
    };

    if (processInstanceId) {
      loadTasks();
    }
  }, [processInstanceId]);

  // Определяем шаги процесса
  const taskSteps: { [key: string]: string } = {
    "send_request_info": "Отправка запроса",
    "send_required_documents": "Отправка документов",
    "set_status_sent": "Статус: отправлено",
    "receive_feedback": "Получение обратной связи",
  };

  // Определяем текущий шаг
  const currentStep = activeTasks.length > 0 ? Object.keys(taskSteps).indexOf(activeTasks[0]) : 0;

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Steps current={currentStep} direction="horizontal" size="small">
          {Object.entries(taskSteps).map(([taskId, label]) => (
            <Step key={taskId} title={label} status={activeTasks.includes(taskId) ? "process" : "wait"} />
          ))}
        </Steps>
      )}
    </div>
  );
};

export default StudentProcessSteps;
