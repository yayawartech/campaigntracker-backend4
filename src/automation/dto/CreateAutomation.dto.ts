import { Row } from '../Row';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateAutomationDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  budgetType: string;
  options: string;
  status: string;
  budgetPercent: string;
  budgetAmount: string;
  automationInMinutes: string;
  post_to_database: boolean;
  data: Row[];
  lastRun: string | null;
  nextRun: string | null;
}
