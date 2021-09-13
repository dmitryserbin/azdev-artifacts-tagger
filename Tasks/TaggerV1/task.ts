/* eslint-disable @typescript-eslint/no-explicit-any */

import { IBuildHelper } from "./interfaces/ibuildhelper";
import { IParameters } from "./interfaces/iparameters";
import { IEndpoint } from "./interfaces/iendpoint";
import { Tagger } from "./tagger/tagger";
import { ITaskHelper } from "./interfaces/itaskhelper";
import { TaskHelper } from "./helpers/taskhelper";
import { IApiFactory } from "./interfaces/iapifactory";
import { ApiFactory } from "./factories/apifactory";
import { IHelperFactory } from "./interfaces/ihelperfactory";
import { HelperFactory } from "./factories/helperfactory";

async function run() {

    const taskHelper: ITaskHelper = new TaskHelper();

    try {

        const endpoint: IEndpoint = await taskHelper.getEndpoint();
        const parameters: IParameters = await taskHelper.getParameters();

        const apiFactory: IApiFactory = new ApiFactory(endpoint);
        const helperFactory: IHelperFactory = new HelperFactory(apiFactory);
        const buildHelper: IBuildHelper = await helperFactory.createBuildHelper();

        const tagger = new Tagger(buildHelper);

        await tagger.tag(parameters.artifacts, parameters.tags, parameters.remove);

    } catch (error: any) {

        await taskHelper.fail(error.message);

    }

}

run();
