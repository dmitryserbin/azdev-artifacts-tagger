import * as ba from "azure-devops-node-api/BuildApi";
import * as bi from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IHelper } from "./interfaces";

export class Helper implements IHelper {

    private buildApi: ba.IBuildApi;

    constructor(buildApi: ba.IBuildApi) {

        this.buildApi = buildApi;

    }

    public async getBuild(projectName: string, buildId: number): Promise<bi.Build> {

        const result: bi.Build = await this.buildApi.getBuild(buildId, projectName);

        if (!result) {

            throw new Error(`Unable to find ${projectName} project ${buildId} build`);

        }

        return result;

    }

    public async getBuildTags(projectName: string, buildId: number): Promise<string[]> {

        const result: string[] = await this.buildApi.getBuildTags(projectName, buildId);

        return result;

    }

    public async getDefinitionBuilds(projectName: string, definitionId: number, tagName: string): Promise<bi.Build[]> {

        const result: bi.Build[] = await this.buildApi.getBuilds(
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

        return result;

    }

    public async addBuildTag(projectName: string, build: bi.Build, tagName: string): Promise<void> {

        console.log(`Adding ${build.buildNumber!} build ${tagName} tag`);

        const result = await this.buildApi.addBuildTag(projectName, build.id!, tagName);

    }

    public async deleteBuildTag(projectName: string, build: bi.Build, tagName: string): Promise<void> {

        console.log(`Removing ${build.buildNumber} build ${tagName} tag`);

        const result = await this.buildApi.deleteBuildTag(projectName, build.id!, tagName);

    }

}
