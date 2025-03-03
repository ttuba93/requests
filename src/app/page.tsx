"use client";

import { useEffect, useState } from "react";
import { Button, Steps, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const API_BASE_URL = "http://localhost:8000/api"; // Адрес Django API

const processSteps = [
  "Запрос отправлен",
  "Ожидание загрузки документа",
  "Документы отправлены",
  "Ожидание проверки декана",
  "Документы отклонены",
  "Документы приняты",
  "Получена обратная связь",
];

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [processId, setProcessId] = useState<string | null>(
    localStorage.getItem("processId")
  );
  const [currentStep, setCurrentStep] = useState(
    Number(localStorage.getItem("currentStep")) || 0
  );
  const [taskId, setTaskId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Функция маппинга задач в шаги процесса
  const getStepFromTask = (taskName: string) => {
    if (taskName.includes("Send request info")) return 0;
    if (taskName.includes("Set status Awaiting")) return 1;
    if (taskName.includes("Upload document")) return 2;
    if (taskName.includes("Documents Verification")) return 3;
    if (taskName.includes("Set status Denied")) return 4;
    if (taskName.includes("Set status Accepted")) return 5;
    if (taskName.includes("Receive a feedback")) return 6;
    return 0;
  };

  // Запуск нового процесса
  const startNewProcess = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/start-process/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: "12345", initiator: "demo" }),
      });
      const data = await response.json();
      if (data.processInstanceId) {
        message.success("Процесс запущен!");
        setProcessId(data.processInstanceId);
        localStorage.setItem("processId", data.processInstanceId);
        setCurrentStep(1);
        localStorage.setItem("currentStep", "1");
      } else {
        message.error("Ошибка запуска процесса");
      }
    } catch (error) {
      message.error("Ошибка подключения к серверу");
    }
    setLoading(false);
  };

  // Получение текущего статуса процесса
  const fetchProcessStatus = async () => {
    if (!processId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/?user_id=demo`);
      const tasks = await response.json();
      const task = tasks.find((t: any) => t.processInstanceId === processId);
      if (task) {
        const step = getStepFromTask(task.name);
        setCurrentStep(step);
        localStorage.setItem("currentStep", String(step));
        setTaskId(task.id);
      }
    } catch (error) {
      message.error("Ошибка загрузки статуса");
    }
  };

  // Завершение текущего шага (переход к следующему)
  const completeCurrentTask = async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/tasks/${taskId}/complete/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variables: {} }),
        }
      );

      if (response.ok) {
        message.success("Шаг завершен!");
        fetchProcessStatus();
      } else {
        message.error("Ошибка завершения шага");
      }
    } catch (error) {
      message.error("Ошибка подключения к серверу");
    }
    setLoading(false);
  };

  // Загрузка файла студентом
  const handleUpload = async () => {
    if (!file) {
      message.warning("Выберите файл перед загрузкой");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("processId", processId || "");

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/upload-document/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        message.success("Документ загружен!");
        completeCurrentTask(); // После загрузки документа двигаем процесс
      } else {
        message.error("Ошибка загрузки документа");
      }
    } catch (error) {
      message.error("Ошибка при загрузке файла");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (processId) {
      fetchProcessStatus();
      const interval = setInterval(fetchProcessStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [processId]);

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "auto",
        padding: "20px",
        backgroundColor: "white",
        color: "black",
        minHeight: "100vh",
      }}
    >
      <h1>Процесс оформления</h1>

      <Button
        type="primary"
        onClick={startNewProcess}
        loading={loading}
        style={{ marginBottom: 20 }}
      >
        Запустить процесс
      </Button>

      {processId ? (
        <div>
          <h3>Процесс ID: {processId}</h3>
          <Steps current={currentStep} direction="vertical" size="small">
            {processSteps.map((step, index) => (
              <Steps.Step key={index} title={step} />
            ))}
          </Steps>

          {/* Если студент должен загрузить документ */}
          {currentStep === 1 && (
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Выбрать файл</Button>
            </Upload>
          )}

          {file && currentStep === 1 && (
            <Button
              type="primary"
              onClick={handleUpload}
              loading={loading}
              style={{ marginTop: 10 }}
            >
              Отправить документ
            </Button>
          )}

          {/* Если можно завершить текущий шаг (например, декан проверил документы) */}
          {taskId && currentStep > 1 && currentStep < 6 && (
            <Button
              type="primary"
              onClick={completeCurrentTask}
              loading={loading}
              style={{ marginTop: 20 }}
            >
              Завершить текущий шаг
            </Button>
          )}
        </div>
      ) : (
        <p>Нет активных процессов</p>
      )}
    </div>
  );
};

export default Home;


// import { useEffect, useState } from "react";
// import { Button, Steps, Spin, message } from "antd";

// const API_BASE_URL = "http://localhost:8000/api"; // Адрес Django API

// const processSteps = [
//   "Запрос отправлен",
//   "Ожидание загрузки документа",
//   "Документы отправлены",
//   "Проверка документов",
//   "Документы отклонены",
//   "Документы приняты",
//   "Получена обратная связь",
// ];

// const Home = () => {
//   const [loading, setLoading] = useState(false);
//   const [processId, setProcessId] = useState<string | null>(
//     localStorage.getItem("processId")
//   );
//   const [currentStep, setCurrentStep] = useState(
//     Number(localStorage.getItem("currentStep")) || 0
//   );
//   const [taskId, setTaskId] = useState<string | null>(null);

//   // Функция маппинга задач в шаги процесса
//   const getStepFromTask = (taskName: string) => {
//     if (taskName.includes("Send request info")) return 0;
//     if (taskName.includes("Set status Awaiting")) return 1;
//     if (taskName.includes("Send required documents")) return 2;
//     if (taskName.includes("Documents Verification")) return 3;
//     if (taskName.includes("Set status Denied")) return 4;
//     if (taskName.includes("Set status Accepted")) return 5;
//     if (taskName.includes("Receive a feedback")) return 6;
//     return 0;
//   };

//   // Запуск нового процесса
//   const startNewProcess = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/start-process/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ student_id: "12345", initiator: "demo" }),
//       });
//       const data = await response.json();
//       if (data.processInstanceId) {
//         message.success("Процесс запущен!");
//         setProcessId(data.processInstanceId);
//         localStorage.setItem("processId", data.processInstanceId);
//         setCurrentStep(1);
//         localStorage.setItem("currentStep", "1");
//       } else {
//         message.error("Ошибка запуска процесса");
//       }
//     } catch (error) {
//       message.error("Ошибка подключения к серверу");
//     }
//     setLoading(false);
//   };

//   // Получение текущего статуса процесса
//   const fetchProcessStatus = async () => {
//     if (!processId) return;
//     try {
//       const response = await fetch(`${API_BASE_URL}/tasks/`);
//       const tasks = await response.json();
//       const task = tasks.find((t: any) => t.processInstanceId === processId);
//       if (task) {
//         const step = getStepFromTask(task.name);
//         setCurrentStep(step);
//         localStorage.setItem("currentStep", String(step));
//         setTaskId(task.id);
//       }
//     } catch (error) {
//       message.error("Ошибка загрузки статуса");
//     }
//   };

//   // Завершение текущего шага (переход к следующему)
//   const completeCurrentTask = async () => {
//     if (!taskId) return;
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/tasks/${taskId}/complete/`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ variables: {} }), // Можно передавать переменные процесса
//         }
//       );

//       if (response.ok) {
//         message.success("Шаг завершен!");
//         fetchProcessStatus(); // Обновляем данные о процессе
//       } else {
//         message.error("Ошибка завершения шага");
//       }
//     } catch (error) {
//       message.error("Ошибка подключения к серверу");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (processId) {
//       fetchProcessStatus();
//       const interval = setInterval(fetchProcessStatus, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [processId]);

//   return (
//     <div
//       style={{
//         maxWidth: 700,
//         margin: "auto",
//         padding: "20px",
//         backgroundColor: "white",
//         color: "black",
//         minHeight: "100vh",
//       }}
//     >
//       <h1>Процесс оформления</h1>

//       <Button
//         type="primary"
//         onClick={startNewProcess}
//         loading={loading}
//         style={{ marginBottom: 20 }}
//       >
//         Запустить процесс
//       </Button>

//       {processId ? (
//         <div>
//           <h3>Процесс ID: {processId}</h3>
//           <Steps current={currentStep} direction="vertical" size="small">
//             {processSteps.map((step, index) => (
//               <Steps.Step key={index} title={step} />
//             ))}
//           </Steps>

//           {taskId && (
//             <Button
//               type="primary"
//               onClick={completeCurrentTask}
//               loading={loading}
//               style={{ marginTop: 20 }}
//             >
//               Завершить текущий шаг
//             </Button>
//           )}
//         </div>
//       ) : (
//         <p>Нет активных процессов</p>
//       )}
//     </div>
//   );
// };

// export default Home;


// // import StartProcessButton from "./components/StartProcessButton";
// // import StudentProcessSteps from "./components/StudentProcessSteps";
// // import Link from "next/link";

// // export default function Home() {
// //   const processInstanceId = "Process_student";
// //     return (
// //         <div>
// //             <h1 className="text-xl font-bold">Student Process</h1>
// //             <StartProcessButton />
// //             <StudentProcessSteps processInstanceId={processInstanceId} />
// //             {/* <ul className="mt-4">
// //                 <li>
// //                     <Link href="/process?definitionId=Process_student&instanceId=123" className="text-blue-600 underline">
// //                         Request #1
// //                     </Link>
// //                 </li>
// //             </ul> */}
// //         </div>
// //     );
// // }

// import { useEffect, useState } from "react";
// import { Button, Steps, Spin, message } from "antd";

// const API_BASE_URL = "http://localhost:8000/api"; // Адрес Django API

// const processSteps = [
//   "Запрос отправлен",
//   "Ожидание ответа студента",
//   "Документы отправлены",
//   "Проверка документов",
//   "Документы отклонены",
//   "Документы приняты",
//   "Получена обратная связь",
// ];

// const Home = () => {
//   const [loading, setLoading] = useState(false);
//   const [processId, setProcessId] = useState<string | null>(null);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [taskId, setTaskId] = useState<string | null>(null);

//   // Запуск нового процесса
//   const startNewProcess = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/start-process/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ student_id: "12345", initiator: "demo" }),
//       });
//       const data = await response.json();
//       if (data.processInstanceId) {
//         message.success("Процесс запущен!");
//         setProcessId(data.processInstanceId);
//         setCurrentStep(1); // Процесс стартует на первом шаге
//       } else {
//         message.error("Ошибка запуска процесса");
//       }
//     } catch (error) {
//       message.error("Ошибка подключения к серверу");
//     }
//     setLoading(false);
//   };

//   // Получение текущего статуса процесса
//   const fetchProcessStatus = async () => {
//     if (!processId) return;
//     try {
//       const response = await fetch(`${API_BASE_URL}/tasks/`);
//       const tasks = await response.json();
//       const task = tasks.find((t: any) => t.processInstanceId === processId);
//       if (task) {
//         setCurrentStep(getStepFromTask(task.name));
//         setTaskId(task.id);
//       }
//     } catch (error) {
//       message.error("Ошибка загрузки статуса");
//     }
//   };

//   // Функция маппинга задач в шаги процесса
//   const getStepFromTask = (taskName: string) => {
//     if (taskName.includes("Send request info")) return 0;
//     if (taskName.includes("Set status Awaiting")) return 1;
//     if (taskName.includes("Send required documents")) return 2;
//     if (taskName.includes("Documents Verification")) return 3;
//     if (taskName.includes("Set status Denied")) return 4;
//     if (taskName.includes("Set status Accepted")) return 5;
//     if (taskName.includes("Receive a feedback")) return 6;
//     return 0;
//   };

//   // Завершение текущего шага (переход к следующему)
//   const completeCurrentTask = async () => {
//     if (!taskId) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ variables: {} }), // Можно передавать переменные процесса
//       });

//       if (response.ok) {
//         message.success("Шаг завершен!");
//         setCurrentStep((prev) => prev + 1); // Двигаем шаг вперед
//         fetchProcessStatus(); // Обновляем данные о процессах
//       } else {
//         message.error("Ошибка завершения шага");
//       }
//     } catch (error) {
//       message.error("Ошибка подключения к серверу");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (processId) {
//       const interval = setInterval(fetchProcessStatus, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [processId]);

//   return (
//     <div       
//     style={{
//       maxWidth: 700,
//       margin: "auto",
//       padding: "20px",
//       backgroundColor: "white",
//       color: "black",
//       minHeight: "100vh",
//     }}>
//       <h1>Процесс оформления</h1>

//       <Button type="primary" onClick={startNewProcess} loading={loading} style={{ marginBottom: 20 }}>
//         Запустить процесс
//       </Button>

//       {processId ? (
//         <div>
//           <h3>Процесс ID: {processId}</h3>
//           <Steps current={currentStep} direction="vertical" size="small">
//             {processSteps.map((step, index) => (
//               <Steps.Step key={index} title={step} />
//             ))}
//           </Steps>

//           {taskId && (
//             <Button type="primary" onClick={completeCurrentTask} loading={loading} style={{ marginTop: 20 }}>
//               Завершить текущий шаг
//             </Button>
//           )}
//         </div>
//       ) : (
//         <p>Нет активных процессов</p>
//       )}
//     </div>
//   );
// };

// export default Home;
