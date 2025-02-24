const API_URL = "http://localhost:8080/engine-rest";

export const fetchProcessXml = async (processDefinitionId: string) => {
  const response = await fetch(`${API_URL}/process-definition/${processDefinitionId}/xml`);
  const data = await response.json();
  return data.bpmn20Xml;
};

export const fetchActiveTasks = async (processInstanceId: string) => {
  const response = await fetch(`${API_URL}/history/activity-instance?processInstanceId=${processInstanceId}`);
  const data = await response.json();
  return data.filter((task: any) => !task.endTime).map((task: any) => task.activityId);
};

export const fetchUserTasks = async (userId: string) => {
  const response = await fetch(`${API_URL}/task?assignee=${userId}`);
  return response.json();
};

export const fetchInitiator = async (processInstanceId: string) => {
  const response = await fetch(`${API_URL}/history/variable-instance?processInstanceId=${processInstanceId}&variableName=initiator`);
  const data = await response.json();
  return data.length ? data[0].value : null;
};
