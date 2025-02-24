"use client";

import { useState } from "react";
import Link from "next/link";
import { startProcess } from "./utils/camundaApi"; // Убедись, что этот путь верный

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [instanceId, setInstanceId] = useState<string | null>(null);

  // Функция запуска процесса
  const handleStartProcess = async () => {
    setLoading(true);
    try {
      const response = await startProcess("Process_student", "user123"); // Исправлено с myProcess на Process_student
      if (response && response.id) {
        setInstanceId(response.id); // Сохраняем ID экземпляра процесса
      }
    } catch (error) {
      console.error("Ошибка запуска процесса:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Requests</h1>
      <ul className="mt-4">
        <li>
          <Link href={`/process?definitionId=Process_student&instanceId=123`} className="text-blue-600 underline">
            Request #1
          </Link>
        </li>
      </ul>

      <button
        onClick={handleStartProcess}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {loading ? "Запуск..." : "Запустить процесс"}
      </button>

      {instanceId && (
        <p className="mt-2">
          ✅ Процесс запущен!{" "}
          <Link href={`/process?definitionId=Process_student&instanceId=${instanceId}`} className="text-blue-600 underline">
            Перейти к процессу
          </Link>
        </p>
      )}
    </div>
  );
}
