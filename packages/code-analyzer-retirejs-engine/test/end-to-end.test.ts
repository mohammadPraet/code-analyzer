import {RetireJsEnginePlugin} from "../src";
import {Engine, EnginePluginV1, EngineRunResults, RuleDescription} from "@salesforce/code-analyzer-engine-api";
import path from "node:path";
import {changeWorkingDirectoryToPackageRoot} from "./test-helpers";

changeWorkingDirectoryToPackageRoot();

/**
 * NOTE THAT WE WANT TO KEEP THE AMOUNT OF TESTS HERE TO A MINIMUM!
 * All functionality should be tested at the unit level. This file ideally should only contain 1 (maybe 2) tests
 * at most to simply confirm that things can wire up correctly without failure.
 */
describe('End to end test', () => {
    it('Test typical end to end workflow', async () => {
        const plugin: EnginePluginV1 = new RetireJsEnginePlugin();
        const availableEngineNames: string[] = plugin.getAvailableEngineNames();
        expect(availableEngineNames).toHaveLength(1);
        const engine: Engine = plugin.createEngine(availableEngineNames[0], {});
        const ruleDescriptions: RuleDescription[] = await engine.describeRules();
        expect(ruleDescriptions).toHaveLength(4);
        const ruleNames: string[] = ruleDescriptions.map(rd => rd.name);
        const engineRunResults: EngineRunResults = await engine.runRules(ruleNames, {
            workspaceFiles: [
                path.resolve('test', 'test-data', 'scenarios', '1_hasJsLibraryWithVulnerability'), // Expect 3 violations: 1 file with 3 vulnerabilities
                path.resolve('test', 'test-data', 'scenarios', '6_hasVulnerableResourceAndZipFiles', 'ZipFileAsResource.resource'), // Expect 6 violations: 2 files each with 3 vulnerabilities
            ]
        });
        expect(engineRunResults.violations).toHaveLength(9);
        // The details of these violations are already tested in the unit test files so no need to go crazy here.
    });
});