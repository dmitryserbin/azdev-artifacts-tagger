import { IBuildApi } from "azure-devops-node-api/BuildApi";

import { BuildHelper } from "../helpers/buildhelper";
import { IApiFactory } from "../interfaces/iapifactory";
import { IBuildHelper } from "../interfaces/ibuildhelper";
import { IHelperFactory } from "../interfaces/ihelperfactory";

export class HelperFactory implements IHelperFactory {

    private apiFactory: IApiFactory;

    constructor(apiFactory: IApiFactory) {

        this.apiFactory = apiFactory;

    }

    public async createBuildHelper(): Promise<IBuildHelper> {

        const buildApi: IBuildApi = await this.apiFactory.createBuildApi();

        return new BuildHelper(buildApi);

    }

}
