import * as bi from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IHelper, ITagger } from "./interfaces";

export class Tagger implements ITagger {

    private helper: IHelper;

    constructor(helper: IHelper) {

        this.helper = helper;

    }

    public async addBuildTag(projectName: string, buildId: number, tagName: string): Promise<void> {

        // Get target build
        const targetBuild: bi.Build = await this.helper.getBuild(projectName, buildId);

        // Get target build tags
        const targetBuildTags: string[] = await this.helper.getBuildTags(projectName, buildId);

        if (targetBuildTags.includes(tagName)) {

            console.log(`Build ${targetBuild.buildNumber} already ${tagName} tagged`);

        } else {

            // Add build tag
            await this.helper.addBuildTag(projectName, targetBuild, tagName);

        }

    }

    public async removeDefinitionTag(projectName: string, definitionId: number, excludeBuildId: number, tagName: string): Promise<void> {

        // Get definition builds
        const targetBuilds: bi.Build[] = await this.helper.getDefinitionBuilds(projectName, definitionId, tagName);

        for (const build of targetBuilds.filter((i) => i.id !== excludeBuildId)) {

            // Remove build tag
            await this.helper.deleteBuildTag(projectName, build, tagName);

        }
    }

}
