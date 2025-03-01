// "use client";

// import StartProcessButton from "./components/StartProcessButton";
// import StudentProcessSteps from "./components/StudentProcessSteps";
// import Link from "next/link";

// export default function Home() {
//   const processInstanceId = "Process_student";
//     return (
//         <div>
//             <h1 className="text-xl font-bold">Student Process</h1>
//             <StartProcessButton />
//             <StudentProcessSteps processInstanceId={processInstanceId} />
//             {/* <ul className="mt-4">
//                 <li>
//                     <Link href="/process?definitionId=Process_student&instanceId=123" className="text-blue-600 underline">
//                         Request #1
//                     </Link>
//                 </li>
//             </ul> */}
//         </div>
//     );
// }

import { useState } from "react";
import { Button, Steps, Spin, message } from "antd";

const API_BASE_URL = "http://localhost:8000"; // Адрес твоего Django API

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [processes, setProcesses] = useState<{ id: string }[]>([]);

  // Запуск нового процесса
  const startNewProcess = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/start-process/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: "12345", initiator: "user1" }),
      });
      const data = await response.json();
      if (data.processInstanceId) {
        message.success("Процесс запущен!");
        setProcesses([...processes, { id: data.processInstanceId }]); // Добавляем процесс в список
      } else {
        message.error("Ошибка запуска процесса");
      }
    } catch (error) {
      message.error("Ошибка подключения к серверу");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "20px" }}>
      <h1>Запуск процессов Camunda</h1>

      <Button type="primary" onClick={startNewProcess} loading={loading} style={{ marginBottom: 20 }}>
        Запустить процесс
      </Button>

      {loading ? (
        <Spin size="large" />
      ) : (
        processes.length > 0 ? (
          processes.map((process) => (
            <div key={process.id} style={{ marginBottom: 20 }}>
              <h3>Процесс ID: {process.id}</h3>
              <Steps
                current={0} // Всегда первый шаг, так как бек не отдает статус
                size="small"
                items={[
                  { title: "Запущен" },
                  { title: "В процессе" },
                  { title: "Завершен" }
                ]}
              />
            </div>
          ))
        ) : (
          <p>Нет активных процессов</p>
        )
      )}
    </div>
  );
};

export default Home;
