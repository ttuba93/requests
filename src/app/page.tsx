import React, { useEffect, useRef, useState } from "react";
import BpmnViewer from "bpmn-js";

const ProcessViewer = ({ processDefinitionId }) => {
  const containerRef = useRef(null);
  const [bpmnModel, setBpmnModel] = useState(null);

  useEffect(() => {
    const viewer = new BpmnViewer({ container: containerRef.current });

    const fetchBPMN = async () => {
      const response = await fetch(
        `http://localhost:8080/engine-rest/process-definition/${processDefinitionId}/xml`
      );
      const data = await response.json();
      viewer.importXML(data.bpmn20Xml);
      setBpmnModel(viewer);
    };

    fetchBPMN();
  }, [processDefinitionId]);

  return <div ref={containerRef} style={{ width: "100%", height: "500px" }} />;
};

export default ProcessViewer;
