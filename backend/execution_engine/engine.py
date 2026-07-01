import random
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
                # For hackathon demo purposes, artificially force a failure 20% of the time to demonstrate self-healing
                if random.random() < 0.2:
                    raise Exception("ECONNREFUSED: Connection to upstream API timed out.")
                    
                result = UniversalAgent.execute(node_name=node.name, intent=intent, context=context)
                
                # Truncate very long outputs for the terminal UI
                short_result = result if len(result) < 300 else result[:300] + "... [truncated]"
                execution_logs.append(f"  └── [SUCCESS] {short_result}")
                
                # Append full result to context for the next node
                context += f"\nOutput from '{node.name}': {result}"
            except Exception as e:
                execution_logs.append(f"  └── [ERROR] {str(e)}")
                execution_logs.append(f"  └── [SYSTEM] Initiating Autonomous Self-Healing Protocol...")
                
                try:
                    healed_result = UniversalAgent.heal(node_name=node.name, intent=intent, error=str(e), context=context)
                    short_result = healed_result if len(healed_result) < 300 else healed_result[:300] + "... [truncated]"
                    execution_logs.append(f"  └── [HEALED] {short_result}")
                    context += f"\nOutput from '{node.name}': {healed_result}"
                except Exception as e2:
                    execution_logs.append(f"  └── [FATAL] Self-Healing Failed. Halting pipeline. Error: {str(e2)}")
                    break # Stop execution on fatal failure
            
        execution_logs.append("[SYSTEM] Pipeline execution finished.")
        return execution_logs
