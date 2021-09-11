import { BuildApi, IBuildApi } from "azure-devops-node-api/BuildApi";
import { WebApi, getPersonalAccessTokenHandler } from "azure-devops-node-api";
import { IRequestOptions, IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";

import { IEndpoint } from "../interfaces/iendpoint";
import { IApiFactory } from "../interfaces/iapifactory";

export class ApiFactory implements IApiFactory {

    private webApi: WebApi;

    constructor(endpoint: IEndpoint) {

        const auth: IRequestHandler = getPersonalAccessTokenHandler(endpoint.token);

        // Use integrated retry mechanism to address
        // Intermittent Azure DevOps connectivity errors
        const options = {

            allowRetries: true,
            maxRetries: 100,
            socketTimeout: 30000,

        } as IRequestOptions;

        this.webApi = new WebApi(endpoint.url, auth, options);

    }

    public async createBuildApi(): Promise<IBuildApi> {

        const buildApi: BuildApi = await this.webApi.getBuildApi();

        return buildApi;

    }

}
