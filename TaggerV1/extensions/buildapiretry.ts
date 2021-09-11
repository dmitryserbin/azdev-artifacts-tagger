import { IBuildApi } from "azure-devops-node-api/BuildApi";
import { Build, BuildQueryOrder, BuildReason, BuildResult, BuildStatus, QueryDeletedOption } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { Retryable } from "../common/retry";
import { IBuildApiRetry } from "../interfaces/ibuildapiretry";

export class BuildApiRetry implements IBuildApiRetry {

    private buildApi: IBuildApi;

    constructor(buildApi: IBuildApi) {

        this.buildApi = buildApi;

    }

    @Retryable()
    public async getBuild(project: string, buildId: number, propertyFilters?: string): Promise<Build> {

        return await this.buildApi.getBuild(project, buildId, propertyFilters);

    }

    @Retryable()
    public async getBuilds(project: string, definitions?: number[], queues?: number[], buildNumber?: string, minTime?: Date, maxTime?: Date, requestedFor?: string, reasonFilter?: BuildReason, statusFilter?: BuildStatus, resultFilter?: BuildResult, tagFilters?: string[], properties?: string[], top?: number, continuationToken?: string, maxBuildsPerDefinition?: number, deletedFilter?: QueryDeletedOption, queryOrder?: BuildQueryOrder, branchName?: string, buildIds?: number[], repositoryId?: string, repositoryType?: string): Promise<Build[]> {

        return await this.buildApi.getBuilds(
            project,
            definitions,
            queues,
            buildNumber,
            minTime,
            maxTime,
            requestedFor,
            reasonFilter,
            statusFilter,
            resultFilter,
            tagFilters,
            properties,
            top,
            continuationToken,
            maxBuildsPerDefinition,
            deletedFilter,
            queryOrder,
            branchName,
            buildIds,
            repositoryId,
            repositoryType);

    }

    @Retryable()
    public async getBuildTags(project: string, buildId: number): Promise<string[]> {

        return await this.buildApi.getBuildTags(project, buildId);

    }

    @Retryable()
    public async addBuildTag(project: string, buildId: number, tag: string): Promise<string[]> {

        return await this.buildApi.addBuildTag(project, buildId, tag);

    }

    @Retryable()
    public async deleteBuildTag(project: string, buildId: number, tag: string): Promise<string[]> {

        return await this.buildApi.deleteBuildTag(project, buildId, tag);

    }

}
