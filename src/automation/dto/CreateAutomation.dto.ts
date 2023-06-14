import { Row } from '../Row';

export class CreateAutomationDto {
  name: string;
  budgetType: string;
  options: string;
  status: string;
  automationInMinutes: string;
  data: Row[];
}
