import { TaskResult, VariableInfo, getBoolInput, getDelimitedInput, getEndpointAuthorizationParameter, getEndpointUrl, getInput, getVariable, getVariables, setResult } from "azure-pipelines-task-lib/task";

import { IParameters } from "../interfaces/iparameters";
import { IArtifact } from "../interfaces/iartifact";
import { IEndpoint } from "../interfaces/iendpoint";
import { ITaskHelper } from "../interfaces/itaskhelper";

export class TaskHelper implements ITaskHelper {

    constructor() { /* */ }

    public async getEndpoint(): Promise<IEndpoint> {

        const endpointType: string | undefined = getInput("EndpointType", true);

        if (!endpointType) {

            throw new Error("Unable to get endpoint type parameter");

        }

        let endpointName: string | undefined = "SYSTEMVSSCONNECTION";
        let tokenParameterName = "AccessToken";

        // Get service endpoint
        if (endpointType === "service") {

            endpointName = getInput("ConnectedService", true);

            if (!endpointName) {

                throw new Error("Unable to get endpoint name parameter");

            }

            tokenParameterName = "ApiToken";

        }

        const endpointUrl = getEndpointUrl(endpointName, false);
        const endpointAuthorizationParameter = getEndpointAuthorizationParameter(endpointName, tokenParameterName, false);

        if (!endpointUrl) {

            throw new Error("Unable to get endpoint URL");

        }

        if (!endpointAuthorizationParameter) {

            throw new Error("Unable to get endpoint authorization parameter");

        }

        const endpoint: IEndpoint = {

            url: endpointUrl,
            token: endpointAuthorizationParameter,

        };

        return endpoint;

    }

    public async getParameters(): Promise<IParameters> {

        const tags: string[] = [];

        const stageNameTag: boolean = getBoolInput("StageNameTag");
        const releaseNameTag: boolean = getBoolInput("ReleaseNameTag");
        const customTags: string[] = getDelimitedInput("CustomTags", "\n", false);
        const removeDuplicates: boolean = getBoolInput("RemoveDuplicates");

        const artifacts: IArtifact[] = await this.getArtifacts();

        if (!artifacts.length) {

            throw new Error("No pipeline artifacts detected");

        }

        const isBuildPipeline: boolean = await this.isBuildPipeline();

        // Get stage name
        if (stageNameTag) {

            let stageName: string | undefined;

            if (isBuildPipeline) {

                stageName = getVariable("System.StageName");

                if (!stageName) {

                    throw new Error("Variable <System.StageName> is empty");

                }

            } else {

                stageName = getVariable("Release.EnvironmentName");

                if (!stageName) {

                    throw new Error("Variable <Release.EnvironmentName> is empty");

                }

            }

            tags.push(stageName);

        }

        // Get release name
        if (releaseNameTag) {

            let releaseName: string | undefined;

            if (isBuildPipeline) {

                releaseName = getVariable("Build.Number");

                if (!releaseName) {

                    throw new Error("Variable <Build.Number> is empty");

                }

            } else {

                releaseName = getVariable("Release.ReleaseName");

                if (!releaseName) {

                    throw new Error("Variable <Release.ReleaseName> is empty");

                }

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

            artifacts,
            tags,
            remove: removeDuplicates,

        } as IParameters;

    }

    public async getArtifacts(): Promise<IArtifact[]> {

        const artifacts: IArtifact[] = [];

        const variables: VariableInfo[] | undefined = getVariables();

        if (Array.isArray(variables) && variables.length <= 0) {

            throw new Error("No pipeline variables detected");

        }

        const artifactVariables: VariableInfo[] | undefined = variables.filter(
            (i) => i.name.startsWith("release.artifacts"));

        if (Array.isArray(artifactVariables) && artifactVariables.length) {

            const releaseArtifacts: string[] | undefined = artifactVariables
                .filter((i) => i.name.match("release.artifacts.*.type") && i.value === "Build")
                .map((i) => i.name.replace(/\.type$/g, ""));

            for (const artifact of releaseArtifacts) {

                const buildId: string | undefined = getVariable(`${artifact}.buildId`);
                const definitionId: string | undefined = getVariable(`${artifact}.definitionId`);
                const projectId: string | undefined = getVariable(`${artifact}.projectId`);

                if (!buildId) {

                    throw new Error(`Variable <${artifact}.buildId> is empty`);

                }

                if (!definitionId) {

                    throw new Error(`Variable <${artifact}.definitionId> is empty`);

                }

                if (!projectId) {

                    throw new Error(`Variable <${artifact}.projectId> is empty`);

                }

                artifacts.push({

                    name: artifact,
                    buildId: Number(buildId),
                    definitionId: Number(definitionId),
                    projectId,

                } as IArtifact);

            }

        } else {

            const buildId: string | undefined = getVariable("Build.BuildId");
            const definitionName: string | undefined = getVariable("Build.DefinitionName");
            const definitionId: string | undefined = getVariable("System.DefinitionId");
            const projectId: string | undefined = getVariable("System.TeamProjectId");

            if (!buildId) {

                throw new Error("Variable <Build.BuildId> is empty");

            }

            if (!definitionName) {

                throw new Error("Variable <Build.DefinitionName> is empty");

            }

            if (!definitionId) {

                throw new Error("Variable <Build.DefinitionId> is empty");

            }

            if (!projectId) {

                throw new Error("Variable <System.TeamProjectId> is empty");

            }

            artifacts.push({

                name: definitionName,
                buildId: Number(buildId),
                definitionId: Number(definitionId),
                projectId,

            } as IArtifact);

        }

        return artifacts;

    }

    public async fail(message: string): Promise<void> {

        setResult(TaskResult.Failed, message);

    }

    private async isBuildPipeline(): Promise<boolean> {

        const hostType = getVariable("System.HostType");

        if (!hostType) {

            throw new Error("Variable <System.HostType> is empty");

        }

        if (hostType === "build") {

            return true;

        } else {

            return false;

        }

    }

}
