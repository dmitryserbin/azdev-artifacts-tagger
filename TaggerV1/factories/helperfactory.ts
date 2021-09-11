import { BuildHelper } from "../helpers/buildhelper";
import { IApiFactory } from "../interfaces/iapifactory";
import { IBuildApiRetry } from "../interfaces/ibuildapiretry";
import { IBuildHelper } from "../interfaces/ibuildhelper";
import { IHelperFactory } from "../interfaces/ihelperfactory";

export class HelperFactory implements IHelperFactory {

    private apiFactory: IApiFactory;

    constructor(apiFactory: IApiFactory) {

        this.apiFactory = apiFactory;

    }

    public async createBuildHelper(): Promise<IBuildHelper> {

        const buildApi: IBuildApiRetry = await this.apiFactory.createBuildApi();

        return new BuildHelper(buildApi);

    }

}
