// import { NextResponse } from "next/server";

// const API_URL = process.env.NEXT_PUBLIC_CAMUNDA_API_URL || "http://localhost:8080/engine-rest";

// /**
//  * Запускает процесс "Process_student" в Camunda.
//  */
// export const startProcess = async (processDefinitionKey: string = "Process_student", initiator: string) => {
//   try {
//     const response = await fetch(`${API_URL}/process-definition/key/${processDefinitionKey}/start`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         variables: {
//           initiator: { value: initiator, type: "String" }, // 👈 Добавлен initiator
//         },
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("Error Response:", data);
//       throw new Error(`Camunda Error: ${JSON.stringify(data)}`);
//     }

//     console.log("Process started successfully:", data);
//     return data;
//   } catch (error) {
//     console.error("API Error:", (error as Error).message);
//     return null;
//   }
// };
