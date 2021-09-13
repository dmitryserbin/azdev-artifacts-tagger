import { Build } from "azure-devops-node-api/interfaces/BuildInterfaces";

export interface IBuildHelper {

    getBuild(projectId: string, buildId: number): Promise<Build>;
    getBuildTags(projectId: string, buildId: number): Promise<string[]>;
    getDefinitionBuilds(projectId: string, definitionId: number, tagName: string): Promise<Build[]>;
    addBuildTag(projectId: string, build: Build, tagName: string): Promise<void>;
    deleteBuildTag(projectId: string, build: Build, tagName: string): Promise<void>;

}
