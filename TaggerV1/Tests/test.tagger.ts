import "mocha";

import * as chai from "chai";
import * as TypeMoq from "typemoq";

import * as bi from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IHelper, ITagger } from "../interfaces";
import { Tagger } from "../tagger";

describe("Deployer", () => {

    const projectName = "My-Project";
    const tagName = "My-Tag-One";

    const buildId = 1;
    const buildNumber = "My-Build-01";
    const definitionId = 1;

    const consoleLog = console.log;
    const helperMock = TypeMoq.Mock.ofType<IHelper>();

    it("Should add build tag", async () => {

        const buildMock = {

            id: buildId,
            buildNumber,

        } as bi.Build;

        const tagsMock = [

            "My-Tag-Two",
            "My-Tag-Three",

        ];

        helperMock.setup((x) => x.getBuild(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyNumber())).returns(() => Promise.resolve(buildMock));
        helperMock.setup((x) => x.getBuildTags(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyNumber())).returns(() => Promise.resolve(tagsMock));
        helperMock.setup((x) => x.addBuildTag(TypeMoq.It.isAnyString(), TypeMoq.It.isAny(), TypeMoq.It.isAnyString())).returns(() => Promise.resolve(console.log(`Adding ${buildNumber} build ${tagName} tag`)));

        const tagger: ITagger = new Tagger(helperMock.target);

        // Hide console output
        console.log = () => { /* */ };

        // Run tagger
        await tagger.addBuildTag(projectName, buildId, tagName);

        // Restore console output
        console.log = consoleLog;

    });

    it("Should skip adding build tag", async () => {

        const buildMock = {

            id: buildId,
            buildNumber,

        } as bi.Build;

        const tagsMock = [

            tagName,

        ];

        helperMock.setup((x) => x.getBuild(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyNumber())).returns(() => Promise.resolve(buildMock));
        helperMock.setup((x) => x.getBuildTags(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyNumber())).returns(() => Promise.resolve(tagsMock));

        const tagger: ITagger = new Tagger(helperMock.target);

        // Hide console output
        console.log = () => { /* */ };

        // Run tagger
        await tagger.addBuildTag(projectName, buildId, tagName);

        // Restore console output
        console.log = consoleLog;

    });

    it("Should remove definition tag", async () => {

        const excludeBuildId = buildId;

        const buildMockOne = {

            id: buildId,
            buildNumber,

        } as bi.Build;

        const buildMockTwo = {

            id: 1,
            buildNumber: "My-Build-02",

        } as bi.Build;

        helperMock.setup((x) => x.getDefinitionBuilds(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyString())).returns(() => Promise.resolve([ buildMockOne, buildMockTwo ] as bi.Build[]));

        const tagger: ITagger = new Tagger(helperMock.target);

        // Hide console output
        console.log = () => { /* */ };

        // Run tagger
        await tagger.removeDefinitionTag(projectName, definitionId, excludeBuildId, tagName);

        // Restore console output
        console.log = consoleLog;

    });

});
