const API_URL = process.env.NEXT_PUBLIC_CAMUNDA_API_URL || "http://localhost:8080/engine-rest";

/**
 * Получает XML-диаграмму процесса.
 */
export const fetchProcessXml = async (processDefinitionId: string) => {
  try {
    const response = await fetch(`${API_URL}/process-definition/${processDefinitionId}/xml`);
    if (!response.ok) throw new Error(`Ошибка загрузки XML процесса: ${response.statusText}`);
    const data = await response.json();
    return data.bpmn20Xml;
  } catch (error) {
    console.error("Ошибка получения XML процесса:", error);
    return null;
  }
};

/**
 * Получает список активных задач процесса.
 */
export const fetchActiveTasks = async (processInstanceId: string) => {
  try {
    const response = await fetch(`${API_URL}/history/activity-instance?processInstanceId=${processInstanceId}`);
    if (!response.ok) throw new Error(`Ошибка загрузки активных задач: ${response.statusText}`);
    const data = await response.json();
    return data.filter((task: any) => !task.endTime).map((task: any) => task.activityId);
  } catch (error) {
    console.error("Ошибка получения активных задач:", error);
    return [];
  }
};

/**
 * Получает список задач пользователя.
 */
export const fetchUserTasks = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/task?assignee=${userId}`);
    if (!response.ok) throw new Error(`Ошибка загрузки задач пользователя: ${response.statusText}`);
    return response.json();
  } catch (error) {
    console.error("Ошибка получения задач пользователя:", error);
    return [];
  }
};

/**
 * Получает инициатора процесса.
 */
export const fetchInitiator = async (processInstanceId: string) => {
  try {
    const response = await fetch(
      `${API_URL}/history/variable-instance?processInstanceId=${processInstanceId}&variableName=initiator`
    );
    if (!response.ok) throw new Error(`Ошибка загрузки инициатора процесса: ${response.statusText}`);
    const data = await response.json();
    return data.length ? data[0].value : null;
  } catch (error) {
    console.error("Ошибка получения инициатора:", error);
    return null;
  }
};

/**
 * Запускает процесс в Camunda.
 */
export const startProcess = async (processDefinitionKey: string, initiator: string) => {
  try {
    const response = await fetch(`${API_URL}/process-definition/key/${processDefinitionKey}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variables: {
          initiator: { value: initiator, type: "String" },
        },
      }),
    });

    if (!response.ok) throw new Error(`Ошибка запуска процесса: ${response.statusText}`);
    return response.json();
  } catch (error) {
    console.error("Ошибка запуска процесса:", error);
    return null;
  }
};
