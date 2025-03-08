import {MethodDeclaration, Project, Signature, SourceFile} from 'ts-morph';
import path from 'node:path';
import fs from 'node:fs';

const controllerDirectory = path.resolve(__dirname, '../src/controllers');

// Init ts-morph project with controller files
const project = new Project({
  tsConfigFilePath: path.resolve(__dirname, '../tsconfig.json'),
});
const sourceFiles = project
  .addDirectoryAtPath(controllerDirectory)
  .getSourceFiles();

interface Endpoint {
  method?: string;
  path?: string;
  options?: any;
  response?: {
    status: string;
    options: any;
  };
  functionName?: string;
  functionSignature?: string;
}

function parseSignature(method: MethodDeclaration): string {
  const declaration = method.getSignature().getDeclaration().getText();
  // Get function signature by matching from \n to {
  const signature = declaration.match(/\}\)\s((.*?)\s*\):(.*?))\s\{/sg)?.[0].slice(2,-1).trim();
  return signature || '';
}

function getEndpoints(sourceFile: SourceFile): Endpoint[] {
  // Iterate over every class method in the source file
  const endpoints: Endpoint[] = sourceFile.getClasses().flatMap(cls =>
    cls.getMethods().map(method => {
      // Get decorators of method
      const decorators = method.getDecorators();
      let endpoint: Endpoint = {
        functionName: method.getName(),
        functionSignature: parseSignature(method),
      };

      decorators.forEach(decorator => {
        const decoratorName = decorator.getName();
        const args = decorator.getArguments();

        // Check if decorator is method decorator
        if (['get', 'post', 'put', 'del', 'patch'].includes(decoratorName)) {
          endpoint = {
            ...endpoint,
            method: decoratorName.toUpperCase(),
            path: args[0]?.getText(),
            options: args[1]
              ?.getType()
              .getProperties()
              .reduce((acc, prop) => {
                return {
                  ...acc,
                  [prop.getName()]: args[1]
                    ?.getType()
                    .getProperty(prop.getName())
                    ?.getName(),
                };
              }, {}),
          };
        }

        // If response decorator, append response info
        if (decoratorName === 'response') {
          endpoint = {
            ...endpoint,
            response: {
              status: args[0]?.getText(),
              options: args[1],
            },
          };
        }
      });

      return endpoint;
    }),
  );
  return endpoints;
}

function generateDocumentation(sourceFile: SourceFile) {
  const endpoints = getEndpoints(sourceFile);
  // console.log(endpoints);
  const controllerName = sourceFile.getBaseNameWithoutExtension().split('.')[0];

  // Group by path
  interface GroupedEndpoints {
    [path: string]: Omit<Endpoint, 'path'>[]
  }
  const groupedEndpoints: GroupedEndpoints = endpoints.reduce((acc, endpoint) => {
    const {path, ...withoutPath} = endpoint;
    acc[path as string]= acc[path as string] ? [
      ...acc[path as string],
      withoutPath,
    ] : [withoutPath];
    return acc;
  }, {} as GroupedEndpoints);

  const documentation = `# ${controllerName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
${Object.keys(groupedEndpoints).map(path => {
    return `
## ${path}
${groupedEndpoints[path].map((endpoint) => `
### ${endpoint.method}

\`\`\`ts
${endpoint.functionSignature}
\`\`\`
`).join('\n')}
`;
}).join('\n')}
`;

  fs.writeFileSync(
    path.resolve(__dirname, `./docs/${controllerName}.md`),
    documentation,
  );
}

sourceFiles.forEach(sourceFile => {
  generateDocumentation(sourceFile);
});
