import Debug from "debug";

import * as ba from "azure-devops-node-api/BuildApi";
import * as bi from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IHelper } from "./interfaces";
import { Retry } from "./retry";

const logger = Debug("artifacts-tagger:Helper");

export class Helper implements IHelper {

    private buildApi: ba.IBuildApi;

    constructor(buildApi: ba.IBuildApi) {

        this.buildApi = buildApi;

    }

    public async getBuild(projectName: string, buildId: number): Promise<bi.Build> {

        const verbose = logger.extend("getBuild");

        const result: bi.Build = await this.getBuildRetry(projectName, buildId);

        if (!result) {

            throw new Error(`Unable to find ${projectName} project ${buildId} build`);

        }

        verbose(result);

        return result;

    }

    public async getBuildTags(projectName: string, buildId: number): Promise<string[]> {

        const verbose = logger.extend("getBuildTags");

        const result: string[] = await this.getBuildTagsRetry(projectName, buildId);

        verbose(result);

        return result;

    }

    public async getDefinitionBuilds(projectName: string, definitionId: number, tagName: string): Promise<bi.Build[]> {

        const verbose = logger.extend("getDefinitionBuilds");

        const result: bi.Build[] = await this.getBuildsRetry(projectName, [ definitionId ], [ tagName ]);

        verbose(result);

        return result;

    }

    public async addBuildTag(projectName: string, build: bi.Build, tagName: string): Promise<void> {

        const verbose = logger.extend("addBuildTag");

        console.log(`Adding ${build.buildNumber!} build ${tagName} tag`);

        const result = await this.buildApi.addBuildTag(projectName, build.id!, tagName);

        verbose(result);

    }

    public async deleteBuildTag(projectName: string, build: bi.Build, tagName: string): Promise<void> {

        const verbose = logger.extend("deleteBuildTag");

        console.log(`Removing ${build.buildNumber} build ${tagName} tag`);

        const result = await this.buildApi.deleteBuildTag(projectName, build.id!, tagName);

        verbose(result);

    }

    @Retry()
    private async getBuildRetry(projectName: string, buildId: number): Promise<bi.Build> {

        return await this.buildApi.getBuild(projectName, buildId);

    }

    @Retry()
    private async getBuildTagsRetry(projectName: string, buildId: number): Promise<string[]> {

        return await this.buildApi.getBuildTags(projectName, buildId);

    }

    @Retry()
    private async getBuildsRetry(projectName: string, definitions: number[], tags: string[]): Promise<bi.Build[]> {

        return await this.buildApi.getBuilds(
            projectName,
            definitions,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            tags);

    }

}
