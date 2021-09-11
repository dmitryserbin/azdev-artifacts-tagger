import { IBuildApi } from "azure-devops-node-api/BuildApi";

import { BuildHelper } from "./helpers/buildhelper";
import { IBuildHelper } from "./interfaces/ibuildhelper";
import { IParameters } from "./interfaces/iparameters";
import { IEndpoint } from "./interfaces/iendpoint";
import { Tagger } from "./tagger/tagger";
import { ITaskHelper } from "./interfaces/taskhelper";
import { TaskHelper } from "./helpers/taskhelper";
import { IApiFactory } from "./interfaces/iapifactory";
import { ApiFactory } from "./factories/apifactory";

async function run() {

    const taskHelper: ITaskHelper = new TaskHelper();

    try {

        const endpoint: IEndpoint = await taskHelper.getEndpoint();
        const parameters: IParameters = await taskHelper.getParameters();

        const apiFactory: IApiFactory = new ApiFactory(endpoint);
        const buildApi: IBuildApi = await apiFactory.createBuildApi();

        const buildHelper: IBuildHelper = new BuildHelper(buildApi);
        const tagger = new Tagger(buildHelper);

        for (const tag of parameters.tags) {

            for (const artifact of parameters.artifacts) {

                // Tag target build
                await tagger.addTag(artifact.projectId, artifact.buildId, tag);

                // Remove duplicated tag from
                // All existing definition builds
                if (parameters.remove) {

                    await tagger.removeTag(artifact.projectId, artifact.definitionId, artifact.buildId, tag);

                }

            }

        }

    } catch (error: any) {

        await taskHelper.fail(error.message);

    }

}

run();
