import { Automation } from "@prisma/client";
import { Row } from "src/automation/Row";

export interface AutomationData {
    automation: Automation;
    apiCallAction: string;
    rulesDisplay: Row;
    
    displayText: Row;
  }
  