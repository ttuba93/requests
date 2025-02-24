"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-xl font-bold">Requests</h1>
      <ul className="mt-4">
        <li>
          <Link href="/process?definitionId=myProcess&instanceId=123" className="text-blue-600 underline">
            Request #1
          </Link>
        </li>
      </ul>
    </div>
  );
}
