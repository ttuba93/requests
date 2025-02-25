export default function Home() {
    const startProcess = async () => {
      try {
        const response = await fetch("/api/camunda/process-definition/key/Process_student/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
          });

  
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log("Процесс запущен:", data);
      } catch (error) {
        console.error("Ошибка при запуске процесса:", error);
      }
    };
  
    return (
      <div>
        <button onClick={startProcess}>Запустить процесс</button>
      </div>
    );
  }
  