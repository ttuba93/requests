import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_CAMUNDA_API_URL || "http://localhost:8080/engine-rest";

export async function POST() {
    try {
        const response = await fetch(`${API_URL}/process-definition/key/Process_student/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                variables: {
                    initiator: { value: "demo", type: "String" }, // 👈 Добавлен initiator
                },
            }),
        });

        const responseText = await response.text(); // 👈 Читаем ответ от Camunda
        console.log("Camunda response:", responseText);

        if (!response.ok) {
            console.error("Failed to start process:", responseText);
            throw new Error(`Failed to start process: ${responseText}`);
        }

        return NextResponse.json(JSON.parse(responseText)); // 👈 Парсим JSON и отправляем клиенту
    } catch (error) {
        console.error("Ошибка API:", error);
        return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    }
}
