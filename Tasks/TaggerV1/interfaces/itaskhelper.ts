import { IArtifact } from "./iartifact";
import { IEndpoint } from "./iendpoint";
import { IParameters } from "./iparameters";

export interface ITaskHelper {

    getEndpoint(): Promise<IEndpoint>;
    getParameters(): Promise<IParameters>;
    getArtifacts(): Promise<IArtifact[]>;
    fail(message: string): Promise<void>;

}
