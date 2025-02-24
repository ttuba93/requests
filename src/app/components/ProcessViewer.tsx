"use client";

import React, { useEffect, useRef, useState } from "react";
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
import { fetchProcessXml, fetchActiveTasks } from "../utils/camundaApi";

interface ProcessViewerProps {
  processDefinitionId: string;
  processInstanceId: string;
}

const ProcessViewer: React.FC<ProcessViewerProps> = ({ processDefinitionId, processInstanceId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<BpmnViewer | null>(null);

  useEffect(() => {
    const initViewer = async () => {
      const xml = await fetchProcessXml(processDefinitionId);
      const bpmnViewer = new BpmnViewer({ container: containerRef.current! });
      await bpmnViewer.importXML(xml);
      setViewer(bpmnViewer);
    };
    initViewer();
  }, [processDefinitionId]);

  useEffect(() => {
    if (viewer) {
      fetchActiveTasks(processInstanceId).then((activeTasks) => {
        const canvas = viewer.get("canvas") as any;
        activeTasks.forEach((taskId: string) => {
          canvas.addMarker(taskId, "highlight");
        });
      });
    }
  }, [viewer]);

  return <div ref={containerRef} className="w-full h-[500px]" />;
};

export default ProcessViewer;
