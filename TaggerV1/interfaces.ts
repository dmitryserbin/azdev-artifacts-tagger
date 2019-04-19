import * as ba from "azure-devops-node-api/BuildApi";
import * as bi from "azure-devops-node-api/interfaces/BuildInterfaces";

export interface IEndpoint {

    url: string;
    token: string;

}

export interface IParameters {

    projectName: string;
    buildId: number;
    definitionId: number;
    tags: string[];
    remove: boolean;

}

export interface IConnection {

    getBuildApi(): Promise<ba.BuildApi>;

}

export interface IHelper {

    getBuild(projectName: string, buildId: number): Promise<bi.Build>;
    getBuildTags(projectName: string, buildId: number): Promise<string[]>;
    getDefinitionBuilds(projectName: string, definitionId: number, tagName: string): Promise<bi.Build[]>;
    addBuildTag(projectName: string, build: bi.Build, tagName: string): Promise<void>;
    deleteBuildTag(projectName: string, build: bi.Build, tagName: string): Promise<void>;

}

export interface ITagger {

    addBuildTag(projectName: string, buildId: number, tagName: string): Promise<void>;
    removeDefinitionTag(projectName: string, definitionId: number, excludeBuildId: number, tagName: string): Promise<void>;

}
