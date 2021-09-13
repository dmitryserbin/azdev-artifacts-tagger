import { IBuildApiRetry } from "./ibuildapiretry";

export interface IApiFactory {

    createBuildApi(): Promise<IBuildApiRetry>;

}
