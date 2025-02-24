"use client";

import StartProcessButton from "./components/StartProcessButton";
import Link from "next/link";

export default function Home() {
    return (
        <div>
            <h1 className="text-xl font-bold">Student Process</h1>
            <StartProcessButton />
            <ul className="mt-4">
                <li>
                    <Link href="/process?definitionId=Process_student&instanceId=123" className="text-blue-600 underline">
                        Request #1
                    </Link>
                </li>
            </ul>
        </div>
    );
}
