import tl = require("azure-pipelines-task-lib/task");

import { IEndpoint, IParameters } from "./interfaces";

export function getEndpoint(): IEndpoint {

    const endpointType: string = tl.getInput("EndpointType", true)!;

    let endpointName: string = "SYSTEMVSSCONNECTION";
    let tokenParameterName: string = "AccessToken";

    // Get service endpoint
    if (endpointType === "service") {

        endpointName = tl.getInput("ConnectedService", true)!;
        tokenParameterName = "ApiToken";

    }

    const endpoint: IEndpoint = {

        url: tl.getEndpointUrl(endpointName, false),
        token: tl.getEndpointAuthorizationParameter(endpointName, tokenParameterName, false)!,

    };

    return endpoint;

}

export function getParameters(): IParameters {

    const tags: string[] = [];

    const stageNameTag: boolean = tl.getBoolInput("StageNameTag");
    const releaseNameTag: boolean = tl.getBoolInput("ReleaseNameTag");
    const customTags: string[] = tl.getDelimitedInput("CustomTags", "\n", false);
    const removeDuplicates: boolean = tl.getBoolInput("RemoveDuplicates");

    const teamProject = tl.getVariable("System.TeamProject");
    const buildId = tl.getVariable("Build.BuildId");
    const definitionId = tl.getVariable("Build.DefinitionId");

    if (!teamProject) {

        throw new Error(`Variable <System.TeamProject> is empty`);

    }

    if (!buildId) {

        throw new Error(`Variable <Build.BuildId> is empty`);

    }

    if (!definitionId) {

        throw new Error(`Variable <Build.DefinitionId> is empty`);

    }

    // Get stage name
    if (stageNameTag) {

        const stageName = tl.getVariable("Release.EnvironmentName");

        if (!stageName) {

            throw new Error(`Variable <Release.EnvironmentName> is empty`);
        }

        tags.push(stageName);

    }

    // Get release name
    if (releaseNameTag) {

        const releaseName = tl.getVariable("Release.ReleaseName");

        if (!releaseName) {

            throw new Error(`Variable <Release.ReleaseName> is empty`);
        }

        tags.push(releaseName);

    }

    // Get custom tags
    if (customTags) {

        for (const tag of customTags) {

            tags.push(tag);

        }

    }

    return {

        projectName: teamProject,
        buildId: Number(buildId),
        definitionId: Number(definitionId),
        tags,
        remove: removeDuplicates,

    } as IParameters;
}
