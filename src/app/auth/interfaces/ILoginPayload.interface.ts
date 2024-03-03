import { UserSessionDto } from "@engo/release-manager-api-client-angular";

export interface ILoginPayload {
    username: string;
    fullname: string;
    userId: string;
    email: string;
    accessToken: string;
    accessTokenExpiresIn: string;
    refreshExpiresIn: string;
    refreshToken: string;
    session: UserSessionDto;
    avatar: string;
}
