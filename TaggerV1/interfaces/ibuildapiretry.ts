import { IBuildApi } from "azure-devops-node-api/BuildApi";
import { Build, BuildQueryOrder, BuildReason, BuildResult, BuildStatus, QueryDeletedOption } from "azure-devops-node-api/interfaces/BuildInterfaces";

export interface IBuildApiRetry extends Partial<IBuildApi> {

    getBuild(project: string, buildId: number, propertyFilters?: string): Promise<Build>;
    getBuilds(project: string, definitions?: number[], queues?: number[], buildNumber?: string, minTime?: Date, maxTime?: Date, requestedFor?: string, reasonFilter?: BuildReason, statusFilter?: BuildStatus, resultFilter?: BuildResult, tagFilters?: string[], properties?: string[], top?: number, continuationToken?: string, maxBuildsPerDefinition?: number, deletedFilter?: QueryDeletedOption, queryOrder?: BuildQueryOrder, branchName?: string, buildIds?: number[], repositoryId?: string, repositoryType?: string): Promise<Build[]>;
    getBuildTags(project: string, buildId: number): Promise<string[]>;
    addBuildTag(project: string, buildId: number, tag: string): Promise<string[]>;
    deleteBuildTag(project: string, buildId: number, tag: string): Promise<string[]>;

}
