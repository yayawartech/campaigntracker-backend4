import { IsNotEmpty } from "class-validator";

export class CreateAdAccountDto {

    @IsNotEmpty()
    readonly accountId: string;

    readonly source: string;

    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly timeZone: string;

    @IsNotEmpty()
    readonly status: string;
}