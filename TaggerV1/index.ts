import tl = require("azure-pipelines-task-lib/task");

import * as ba from "azure-devops-node-api/BuildApi";

import { getEndpoint, getParameters } from "./azdev";
import { Connection } from "./connection";
import { Helper } from "./helper";
import { IConnection, IEndpoint, IHelper, IParameters } from "./interfaces";
import { Tagger } from "./tagger";

async function run() {

    try {

        // Get endpoint
        const endpoint: IEndpoint = getEndpoint();

        // Get parameters
        const parameters: IParameters = getParameters();

        // Create connection
        const connection: IConnection = new Connection(endpoint);
        const buildApi: ba.BuildApi = await connection.getBuildApi();
        const helper: IHelper = new Helper(buildApi);
        const tagger = new Tagger(helper);

        // Tag target build
        for (const tag of parameters.tags) {

            await tagger.addBuildTag(parameters.projectName, parameters.buildId, tag);

            // Remove duplicated tag
            if (parameters.remove) {

                await tagger.removeDefinitionTag(parameters.projectName, parameters.definitionId, parameters.buildId, tag);

            }
        }

    } catch (e: any) {

        tl.setResult(tl.TaskResult.Failed, e.message);

    }

}

run();
