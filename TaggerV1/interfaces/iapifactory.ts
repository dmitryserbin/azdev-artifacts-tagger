import { IBuildApi } from "azure-devops-node-api/BuildApi";

export interface IApiFactory {

    createBuildApi(): Promise<IBuildApi>;

}
