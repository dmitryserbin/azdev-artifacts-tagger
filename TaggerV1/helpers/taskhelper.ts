import { getBoolInput, getDelimitedInput, getEndpointAuthorizationParameter, getEndpointUrl, getInput, getVariable, getVariables, setResult, TaskResult, VariableInfo } from "azure-pipelines-task-lib/task";

import { IParameters } from "../interfaces/iparameters";
import { IArtifact } from "../interfaces/iartifact";
import { IEndpoint } from "../interfaces/iendpoint";
import { ITaskHelper } from "../interfaces/itaskhelper";

export class TaskHelper implements ITaskHelper {

    constructor() { /* */ }

    public async getEndpoint(): Promise<IEndpoint> {

        const endpointType: string = getInput("EndpointType", true)!;

        let endpointName: string = "SYSTEMVSSCONNECTION";
        let tokenParameterName: string = "AccessToken";

        // Get service endpoint
        if (endpointType === "service") {

            endpointName = getInput("ConnectedService", true)!;
            tokenParameterName = "ApiToken";

        }

        const endpoint: IEndpoint = {

            url: getEndpointUrl(endpointName, false)!,
            token: getEndpointAuthorizationParameter(endpointName, tokenParameterName, false)!,

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

            throw new Error(`No pipeline artifacts detected`);

        }

        // Get stage name
        if (stageNameTag) {

            const stageName = getVariable("Release.EnvironmentName");

            if (!stageName) {

                throw new Error(`Variable <Release.EnvironmentName> is empty`);
            }

            tags.push(stageName);

        }

        // Get release name
        if (releaseNameTag) {

            const releaseName = getVariable("Release.ReleaseName");

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

            artifacts,
            tags,
            remove: removeDuplicates,

        } as IParameters;
    }

    public async getArtifacts(): Promise<IArtifact[]> {

        const artifacts: IArtifact[] = [];

        const variables: VariableInfo[] | undefined = getVariables();

        if (!variables) {

            throw new Error(`No release variables detected`);

        }

        const artifactVariables: VariableInfo[] | undefined = variables.filter(
            (i) => i.name.startsWith("release.artifacts"));

        if (!artifactVariables) {

            throw new Error(`No release artifact variables detected`);

        }

        const buildArtifacts: string[] | undefined = artifactVariables.filter(
            (i) => i.name.match("release.artifacts.*.type") && i.value === "Build")
                .map((i) => i.name.replace(".type", ""));

        for (const artifact of buildArtifacts) {

            const buildId: string | undefined = getVariable(`${artifact}.buildId`);
            const definitionId: string | undefined = getVariable(`${artifact}.definitionId`);
            const projectId: string | undefined = getVariable(`${artifact}.projectId`);

            if (!buildId) {

                throw new Error(`Variable <${artifact}.buildId> is empty`);

            }

            if (!definitionId) {

                throw new Error(`Variable <${artifact}.definitionId> is empty`);

            }

            artifacts.push({

                name: artifact,
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

}
