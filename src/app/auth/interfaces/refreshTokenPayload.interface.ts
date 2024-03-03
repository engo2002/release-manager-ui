import { UserSessionDto } from "@engo/release-manager-api-client-angular";

export interface IRefreshTokenPayload {
    accessToken: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
    refreshToken: string;
    session: UserSessionDto;
}
