import { IBuildHelper } from "./ibuildhelper";

export interface IHelperFactory {

    createBuildHelper(): Promise<IBuildHelper>;

}
