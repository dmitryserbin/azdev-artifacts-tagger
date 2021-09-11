import { IArtifact } from "./iartifact";

export interface ITagger {

    tag(artifacts: IArtifact[], tags: string[], remove: boolean): Promise<void>;
    addTag(artifact: IArtifact, tag: string): Promise<void>;
    removeTag(artifact: IArtifact, tag: string): Promise<void>;

}
