"use client";

import { useState } from "react";

const StartProcessButton = () => {
    const [processId, setProcessId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const startProcess = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/start-process", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to start process");
            }

            const data = await response.json();
            setProcessId(data.id);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={startProcess}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
                {loading ? "Запуск..." : "Запустить процесс"}
            </button>
            {processId && <p className="mt-2">✅ Процесс запущен! ID: {processId}</p>}
        </div>
    );
};

export default StartProcessButton;
