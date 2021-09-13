import { BuildApi } from "azure-devops-node-api/BuildApi";

export interface IConnection {

    getBuildApi(): Promise<BuildApi>;

}
