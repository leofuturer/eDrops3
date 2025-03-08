import {MethodDeclaration, Project, Signature, SourceFile} from 'ts-morph';
import path from 'node:path';
import fs from 'node:fs';

const modelDirectory = path.resolve(__dirname, '../src/models');

// Init ts-morph project with controller files
const project = new Project({
  tsConfigFilePath: path.resolve(__dirname, '../tsconfig.json'),
});
const sourceFiles = project
  .addDirectoryAtPath(modelDirectory)
  .getSourceFiles();

interface Model {
  description?: string;
  properties: {
    name: string;
    type: string;
  }[];
}

function getModel(sourceFile: SourceFile): Model{
  // Iterate over every class method in the source file
  const models = sourceFile.getClasses().flatMap(cls => {
    const modelDecorator = cls.getDecorator('model');
    if (!modelDecorator) {
      return [];
    }
    let model = {
      description: modelDecorator.getArguments()?.[0]?.getText().match(/description: '(.*)'/)?.[1],
      properties: [] as Model['properties'],
    }
    model.properties = cls.getProperties().map(member => {
      // Get decorators of method
      const decorators = member.getDecorators();
      const property = {
        name: member.getName(),
        type: member.getType().getText().replace(/import\(.*?\)./g, '')
      };

      // decorators.forEach(decorator => {
      //   const decoratorName = decorator.getName();
      //   const args = decorator.getArguments();

      //   if (decoratorName === 'property') {

      //   }
      // });

      return property;
    });
    return model;
  });
  return models[0];
}

function generateDocumentation(sourceFile: SourceFile) {
  const model = getModel(sourceFile);
  if (!model) return;
  const modelName = sourceFile.getBaseNameWithoutExtension().split('.')[0];
  const modelDisplayName = modelName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()).split('-').join(' ');

  const documentation = `# ${modelDisplayName}
${model.description ? model.description : ''}
${model.properties.map(property => {
    return `
## ${property.name}
Type: ${property.type}
`;
}).join('')}
`;

  fs.writeFileSync(
    path.resolve(__dirname, `./docs/models/${modelName}.md`),
    documentation,
  );
  return `* [${modelDisplayName}](development/database-models/${modelName}.md)`;
}

const index = sourceFiles.map(sourceFile => {
  const entry = generateDocumentation(sourceFile);
  return entry
}).join('\n');
console.log(index);
