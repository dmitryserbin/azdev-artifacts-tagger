import "mocha";

import * as TypeMoq from "typemoq";

import { Build } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { ITagger } from "../interfaces/itagger";
import { IBuildHelper } from "../interfaces/ibuildhelper";
import { Tagger } from "../tagger/tagger";
import { IArtifact } from "../interfaces/iartifact";

describe("Tagger", () => {

    const artifacMock: IArtifact = {

        name: "My-Artifact",
        projectId: "My-Project",
        buildId: 1,
        definitionId: 1,

    };

    const tagName = "My-Tag-One";
    const buildNumber = "My-Build-01";

    const consoleLog = console.log;

    const helperMock = TypeMoq.Mock.ofType<IBuildHelper>();

    it("Should add build tag", async () => {

        const buildMock = {

            id: artifacMock.buildId,
            buildNumber,

        } as Build;

        const tagsMock = [

            "My-Tag-Two",
            "My-Tag-Three",

        ];

        helperMock
            .setup((x) => x.getBuild(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyNumber()))
            .returns(() => Promise.resolve(buildMock));

        helperMock
            .setup((x) => x.getBuildTags(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyNumber()))
            .returns(() => Promise.resolve(tagsMock));

        helperMock
            .setup((x) => x.addBuildTag(TypeMoq.It.isAnyString(), TypeMoq.It.isAny(), TypeMoq.It.isAnyString()))
            .returns(() => Promise.resolve(console.log(`Adding ${buildNumber} build ${tagName} tag`)));

        const tagger: ITagger = new Tagger(helperMock.target);

        // Hide console output
        console.log = () => { /* */ };

        // Run tagger
        await tagger.addTag(artifacMock, tagName);

        // Restore console output
        console.log = consoleLog;

    });

    it("Should skip adding build tag", async () => {

        const buildMock = {

            id: artifacMock.buildId,
            buildNumber,

        } as Build;

        const tagsMock = [

            tagName,

        ];

        helperMock
            .setup((x) => x.getBuild(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyNumber()))
            .returns(() => Promise.resolve(buildMock));

        helperMock
            .setup((x) => x.getBuildTags(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyNumber()))
            .returns(() => Promise.resolve(tagsMock));

        const tagger: ITagger = new Tagger(helperMock.target);

        // Hide console output
        console.log = () => { /* */ };

        // Run tagger
        await tagger.addTag(artifacMock, tagName);

        // Restore console output
        console.log = consoleLog;

    });

    it("Should remove definition tag", async () => {

        const buildMockOne = {

            id: artifacMock.buildId,
            buildNumber,

        } as Build;

        const buildMockTwo = {

            id: 1,
            buildNumber: "My-Build-02",

        } as Build;

        helperMock
            .setup((x) => x.getDefinitionBuilds(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyString()))
            .returns(() => Promise.resolve([ buildMockOne, buildMockTwo ] as Build[]));

        const tagger: ITagger = new Tagger(helperMock.target);

        // Hide console output
        console.log = () => { /* */ };

        // Run tagger
        await tagger.removeTag(artifacMock, tagName);

        // Restore console output
        console.log = consoleLog;

    });

});
