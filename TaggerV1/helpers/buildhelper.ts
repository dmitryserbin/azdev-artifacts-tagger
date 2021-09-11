import Debug from "debug";

import { Build } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IBuildHelper } from "../interfaces/ibuildhelper";
import { IBuildApiRetry } from "../interfaces/ibuildapiretry";

const logger = Debug("artifacts-tagger:Helper");

export class BuildHelper implements IBuildHelper {

    private buildApi: IBuildApiRetry;

    constructor(buildApi: IBuildApiRetry) {

        this.buildApi = buildApi;

    }

    public async getBuild(projectName: string, buildId: number): Promise<Build> {

        const verbose = logger.extend(this.getBuild.name);

        const result: Build = await this.buildApi.getBuild(projectName, buildId);

        if (!result) {

            throw new Error(`Unable to find <${projectName}> project <${buildId}> build`);

        }

        verbose(result);

        return result;

    }

    public async getBuildTags(projectName: string, buildId: number): Promise<string[]> {

        const verbose = logger.extend(this.getBuildTags.name);

        const result: string[] = await this.buildApi.getBuildTags(projectName, buildId);

        verbose(result);

        return result;

    }

    public async getDefinitionBuilds(projectName: string, definitionId: number, tagName: string): Promise<Build[]> {

        const verbose = logger.extend(this.getDefinitionBuilds.name);

        const result: Build[] = await this.buildApi.getBuilds(
            projectName,
            [ definitionId ],
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            [ tagName ]);

        verbose(result);

        return result;

    }

    public async addBuildTag(projectName: string, build: Build, tagName: string): Promise<void> {

        const verbose = logger.extend(this.addBuildTag.name);

        console.log(`Adding <${build.buildNumber!}> build <${tagName}> tag`);

        const result = await this.buildApi.addBuildTag(projectName, build.id!, tagName);

        verbose(result);

    }

    public async deleteBuildTag(projectName: string, build: Build, tagName: string): Promise<void> {

        const verbose = logger.extend(this.deleteBuildTag.name);

        console.log(`Removing <${build.buildNumber}> build <${tagName}> tag`);

        const result = await this.buildApi.deleteBuildTag(projectName, build.id!, tagName);

        verbose(result);

    }

}
