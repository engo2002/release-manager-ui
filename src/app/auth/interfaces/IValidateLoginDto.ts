export interface IValidateLoginDto {
    credentialsValid: boolean;
    twoFactorEnabled?: boolean;
}
