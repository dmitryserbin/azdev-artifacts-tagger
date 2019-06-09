import * as az from "azure-devops-node-api";
import * as ba from "azure-devops-node-api/BuildApi";

import * as vi from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";

import { IConnection, IEndpoint } from "./interfaces";

export class Connection implements IConnection {

    private webApi: az.WebApi;

    constructor(endpoint: IEndpoint) {

        const auth = az.getPersonalAccessTokenHandler(endpoint.token);

        // Use integrated retry mechanism to address
        // Intermittent Azure DevOps connectivity errors
        const options = {

            allowRetries: true,
            maxRetries: 25,

        } as vi.IRequestOptions;

        this.webApi = new az.WebApi(endpoint.url, auth, options);

    }

    public async getBuildApi(): Promise<ba.BuildApi> {

        const buildApi: ba.BuildApi = await this.webApi.getBuildApi();

        return buildApi;

    }

}
