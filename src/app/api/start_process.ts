import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_CAMUNDA_API_URL || "http://localhost:8080/engine-rest";

export async function POST() {
    try {
        const response = await fetch(`${API_URL}/process-definition/key/Process_student/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                variables: {
                    status: { value: "Process Started", type: "String" },
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to start process: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    }
}
