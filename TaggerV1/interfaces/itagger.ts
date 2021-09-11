export interface ITagger {

    addTag(projectId: string, buildId: number, tagName: string): Promise<void>;
    removeTag(projectId: string, definitionId: number, excludeBuildId: number, tagName: string): Promise<void>;

}
