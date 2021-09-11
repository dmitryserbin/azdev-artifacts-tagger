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
                await this.addTag(artifact, tag);

                // Remove other builds tag
                if (remove) {

                    await this.removeTag(artifact, tag);

                }

            }

        }

    }

    public async addTag(artifact: IArtifact, tag: string): Promise<void> {

        // Get target build
        const targetBuild: Build = await this.buildHelper.getBuild(artifact.projectId, artifact.buildId);

        // Get target build tags
        const targetBuildTags: string[] = await this.buildHelper.getBuildTags(artifact.projectId, artifact.buildId);

        if (targetBuildTags.includes(tag)) {

            console.log(`Build <${targetBuild.buildNumber}> already <${tag}> tagged`);

        } else {

            // Add build tag
            await this.buildHelper.addBuildTag(artifact.projectId, targetBuild, tag);

        }

    }

    public async removeTag(artifact: IArtifact, tag: string): Promise<void> {

        // Get definition builds
        const targetBuilds: Build[] = await this.buildHelper.getDefinitionBuilds(artifact.projectId, artifact.definitionId, tag);

        for (const build of targetBuilds.filter((i) => i.id !== artifact.buildId)) {

            // Remove build tag
            await this.buildHelper.deleteBuildTag(artifact.projectId, build, tag);

        }
    }

}
