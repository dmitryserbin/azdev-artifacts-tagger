import { IArtifact } from "./iartifact";

export interface IParameters {

    artifacts: IArtifact[];
    tags: string[];
    remove: boolean;

}
