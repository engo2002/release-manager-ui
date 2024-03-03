import { EUserRoles } from "./userRoles.interface";

export interface INewUser {
    username: string;
    fullname: string;
    password: string;
    email: string;
    primaryRole: EUserRoles | string | null;
    secondaryRole: EUserRoles | string | null;
}
