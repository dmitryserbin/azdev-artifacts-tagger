import { IArtifact } from "./iartifact";

export interface ITagger {

    tag(artifacts: IArtifact[], tags: string[], remove: boolean): Promise<void>;
    addTag(projectId: string, buildId: number, tagName: string): Promise<void>;
    removeTag(projectId: string, definitionId: number, excludeBuildId: number, tagName: string): Promise<void>;

}
