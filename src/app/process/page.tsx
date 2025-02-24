"use client";

import { useSearchParams } from "next/navigation";
import ProcessViewer from "../components/ProcessViewer";
import TaskList from "../components/TaskList";
import { useState, useEffect } from "react";
import { fetchInitiator } from "../utils/camundaApi";

export default function ProcessPage() {
  const searchParams = useSearchParams();
  const definitionId = searchParams.get("definitionId");
  const instanceId = searchParams.get("instanceId");
  const [userId, setUserId] = useState("user123");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (instanceId) {
      fetchInitiator(instanceId).then((initiator) => {
        setUserRole(initiator === userId ? "initiator" : "participant");
      });
    }
  }, [instanceId]);

  if (!definitionId || !instanceId) {
    return <div>Ошибка: Не переданы параметры процесса</div>;
  }

  return (
    <div>
      {userRole === "initiator" ? (
        <ProcessViewer processDefinitionId={definitionId} processInstanceId={instanceId} />
      ) : (
        <TaskList userId={userId} />
      )}
    </div>
  );
}

