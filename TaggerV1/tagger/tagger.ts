import { Build } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { ITagger } from "../interfaces/itagger";
import { IBuildHelper } from "../interfaces/ibuildhelper";
import { IArtifact } from "../interfaces/iartifact";

export class Tagger implements ITagger {

    private buildHelper: IBuildHelper;

    constructor(buildHelper: IBuildHelper) {

        this.buildHelper = buildHelper;

    }

    public async tag(artifacts: IArtifact[], tags: string[], remove: boolean): Promise<void> {

        console.log(`Tagging <${artifacts.length}> build artifacts with <${tags.length}> tags`);

        for (const tag of tags) {

            for (const artifact of artifacts) {

                // Tag target build
                await this.addTag(artifact.projectId, artifact.buildId, tag);

                // Remove other builds tag
                if (remove) {

                    await this.removeTag(artifact.projectId, artifact.definitionId, artifact.buildId, tag);

                }

            }

        }

    }

    public async addTag(projectName: string, buildId: number, tagName: string): Promise<void> {

        // Get target build
        const targetBuild: Build = await this.buildHelper.getBuild(projectName, buildId);

        // Get target build tags
        const targetBuildTags: string[] = await this.buildHelper.getBuildTags(projectName, buildId);

        if (targetBuildTags.includes(tagName)) {

            console.log(`Build <${targetBuild.buildNumber}> already <${tagName}> tagged`);

        } else {

            // Add build tag
            await this.buildHelper.addBuildTag(projectName, targetBuild, tagName);

        }

    }

    public async removeTag(projectName: string, definitionId: number, excludeBuildId: number, tagName: string): Promise<void> {

        // Get definition builds
        const targetBuilds: Build[] = await this.buildHelper.getDefinitionBuilds(projectName, definitionId, tagName);

        for (const build of targetBuilds.filter((i) => i.id !== excludeBuildId)) {

            // Remove build tag
            await this.buildHelper.deleteBuildTag(projectName, build, tagName);

        }
    }

}
