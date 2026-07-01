from typing import List
from models.schemas import WorkflowNode
from agents.universal_agent import UniversalAgent

class ExecutionEngine:
    @staticmethod
    def run(intent: str, nodes: List[WorkflowNode]) -> List[str]:
        execution_logs = []
        context = ""
        
        execution_logs.append("[SYSTEM] AI Execution Engine Initializing...")
        
        for node in nodes:
            execution_logs.append(f"[EXECUTING] Node '{node.name}' ({node.type.upper()})...")
            
            try:
                result = UniversalAgent.execute(node_name=node.name, intent=intent, context=context)
                
                # Truncate very long outputs for the terminal UI
                short_result = result if len(result) < 300 else result[:300] + "... [truncated]"
                execution_logs.append(f"  └── [SUCCESS] {short_result}")
                
                # Append full result to context for the next node
                context += f"\nOutput from '{node.name}': {result}"
            except Exception as e:
                execution_logs.append(f"  └── [FAILED] {str(e)}")
                break # Stop execution on failure
            
        execution_logs.append("[SYSTEM] Pipeline execution finished.")
        return execution_logs
