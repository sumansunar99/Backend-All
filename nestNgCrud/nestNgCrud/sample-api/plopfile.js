/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = function (plop) {
  // Define custom helpers
  plop.setHelper('eq', (v1, v2) => v1 === v2);
  plop.setHelper('or', (...args) =>
    args.slice(0, -1).some((arg) => Boolean(arg)),
  );

  // Function to parse Prisma schema and get fields for a model
  const getModelFields = (modelName, excludeFields) => {
    const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma'); // Update the path as necessary
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const modelRegex = new RegExp(`model ${modelName} \\{[^\\}]*\\}`, 'g');
    const modelString = schema.match(modelRegex);

    if (!modelString) {
      return [];
    }

    const fieldRegex = /(\w+)\s+(\w+[\?]?)/g;
    let fields = [];
    let match;
    while ((match = fieldRegex.exec(modelString[0])) !== null) {
      fields.push({ name: match[1], type: match[2] });
    }

    // Exclude specific fields
    fields = fields.filter((field) => !excludeFields.includes(field.name));

    return fields;
  };

  // code generator
  plop.setGenerator('generator', {
    description: 'Create a new Entity based on Prisma model',
    prompts: [
      {
        type: 'list',
        name: 'parent',
        message: 'Select a parent category:',
        choices: ['Api'],
      },
      {
        when: function (response) {
          return response.parent === 'Api';
        },
        type: 'list',
        name: 'child',
        message: 'Select a child category:',
        choices: ['Blank', 'CRUD'],
      },
      {
        when: function (response) {
          return response.child === 'Blank' || response.child === 'CRUD';
        },
        type: 'list',
        name: 'grandchild',
        message: 'Select a grandchild category:',
        choices: ['Admin', 'User'],
      },
      {
        when: function (response) {
          return (
            response.grandchild === 'Admin' || response.grandchild === 'User'
          );
        },
        type: 'list',
        name: 'action',
        message: 'Select an action:',
        choices: ['Create', 'Get', 'GetList','Update', 'Delete',"All"],
      },
      {
        when: function (response) {
          return (response.action === 'Create' || response.action === 'Get' || response.action === 'GetList' || response.action === 'Update' || response.action === 'Delete' || response.action === 'All');
        },
        type: 'input',
        name: 'name',
        message: 'Model name for the Entity:',
      },
      {
        when: function (response) {
          return (response.action === 'Create' || response.action === 'Get' || response.action === 'GetList' || response.action === 'Update' || response.action === 'Delete');
        },
        type: 'input',
        name: 'apiName',
        message: 'Name for the api:',
      },
      {
        when: function (response) {
          return (response.action === 'Create' || response.action === 'Get' || response.action === 'GetList' || response.action === 'Update' || response.action === 'Delete' || response.action === 'All');
        },
        type: 'input',
        name: 'controllerName',
        message: 'Name for the controller:',
      },
      {
        when: function (response) {
          return (response.action === 'Create' || response.action === 'Get' || response.action === 'GetList' || response.action === 'Update' || response.action === 'Delete' || response.action === 'All');
        },
        type: 'input',
        name: 'moduleName',
        message: 'Name for the Module',
      },
      {
        when: function (response) {
          return (response.action === 'Create' || response.action === 'Get' || response.action === 'GetList' || response.action === 'Update' || response.action === 'Delete' || response.action === 'All');
        },
        type: 'input',
        name: 'folderName',
        message: 'Name for the Folder',
      },
     
    ],
    actions: (data) => {
      let destinationPath = '';
      let appendPath = '';
      if (data.grandchild === 'Admin') {
        destinationPath = 'src/api/admin/';
        appendPath = 'src/api/admin/admin.module.ts';
      } else if (data.grandchild === 'User') {
        destinationPath = 'src/api/user/';
        appendPath = 'src/api/user/user.module.ts';
      }
      if (data.action === 'Create') {
        const excludeFields = [
          'id',
          'createdBy',
          'updatedBy',
          'createdOn',
          'updatedOn',
        ];

        const fields = getModelFields(data.name, excludeFields);
        return [
          {
            type: 'addMany',
            destination: destinationPath,
            base: '.templates/create/',
            templateFiles: '.templates/create/', // Make sure your template files are here
            data: { fields },
          },
          {
            type: 'append',
            path: appendPath,
            pattern: `/* PLOP_INJECT_IMPORT */`,
            template: `import { {{pascalCase apiName}}Controller } from './{{dashCase folderName}}/{{dashCase apiName}}/{{dashCase apiName}}.controller';`,
          },
          {
            type: 'append',
            path: appendPath,
            pattern: `/* PLOP_INJECT_CONTROLLER */`,
            template: `\t\t{{pascalCase apiName}}Controller,`,
          },
          (answers, config, plop) => new Promise((resolve, reject) => {
            console.log('Running npm run format...');
            exec('npm run format', (error, stdout, stderr) => {
              if (error) {
                console.error(`Error executing npm run format: ${error}`);
                reject(error);
              } else if (stderr) {
                console.error(`stderr: ${stderr}`);
                resolve(stderr);  // Log stderr but don't fail the process
              } else {
                console.log('npm run format completed successfully!');
                console.log(stdout);
                resolve(stdout);
              }
            });
          })
          
        ];
      } else if (data.action === 'GetList') {
        const excludeFields = [
          'createdBy',
          'updatedBy',
          'createdOn',
          'updatedOn',
        ];

        const fields = getModelFields(data.name, excludeFields);
        return [
          {
            type: 'addMany',
            destination: destinationPath,
            base: '.templates/get-list/',
            templateFiles: '.templates/get-list/', // Make sure your template files are here
            data: { fields },
          },
          {
            type: 'append',
            path: appendPath,
            pattern: `/* PLOP_INJECT_IMPORT */`,
            template: `import { {{pascalCase apiName}}Controller } from './{{dashCase folderName}}/{{dashCase apiName}}/{{dashCase apiName}}.controller';`,
          },
          {
            type: 'append',
            path: appendPath,
            pattern: `/* PLOP_INJECT_CONTROLLER */`,
            template: `\t\t{{pascalCase apiName}}Controller,`,
          },
          (answers, config, plop) => new Promise((resolve, reject) => {
            console.log('Running npm run format...');
            exec('npm run format', (error, stdout, stderr) => {
              if (error) {
                console.error(`Error executing npm run format: ${error}`);
                reject(error);
              } else if (stderr) {
                console.error(`stderr: ${stderr}`);
                resolve(stderr);  // Log stderr but don't fail the process
              } else {
                console.log('npm run format completed successfully!');
                console.log(stdout);
                resolve(stdout);
              }
            });
          })
        ];
      }
      else if (data.action === 'Update') {
        const excludeFields = [
          'id',
          'createdBy',
          'updatedBy',
          'createdOn',
          'updatedOn',
        ];

        const fields = getModelFields(data.name, excludeFields);
        return [
          {
            type: 'addMany',
            destination: destinationPath,
            base: '.templates/update/',
            templateFiles: '.templates/update/', // Make sure your template files are here
            data: { fields },
          },
          {
            type: 'append',
            path: appendPath,
            pattern: `/* PLOP_INJECT_IMPORT */`,
            template: `import { {{pascalCase apiName}}Controller } from './{{dashCase folderName}}/{{dashCase apiName}}/{{dashCase apiName}}.controller';`,
          },
          {
            type: 'append',
            path: appendPath,
            pattern: `/* PLOP_INJECT_CONTROLLER */`,
            template: `\t\t{{pascalCase apiName}}Controller,`,
          },
          (answers, config, plop) => new Promise((resolve, reject) => {
            console.log('Running npm run format...');
            exec('npm run format', (error, stdout, stderr) => {
              if (error) {
                console.error(`Error executing npm run format: ${error}`);
                reject(error);
              } else if (stderr) {
                console.error(`stderr: ${stderr}`);
                resolve(stderr);  // Log stderr but don't fail the process
              } else {
                console.log('npm run format completed successfully!');
                console.log(stdout);
                resolve(stdout);
              }
            });
          })
        ];
      }
      else if (data.action === 'Get') {
        const excludeFields = [
          'createdBy',
          'updatedBy',
          'createdOn',
          'updatedOn',
        ];

        const fields = getModelFields(data.name, excludeFields);
        return [
          {
            type: 'addMany',
            destination: destinationPath,
            base: '.templates/get/',
            templateFiles: '.templates/get/', // Make sure your template files are here
            data: { fields },
          },
          {
            type: 'append',
            path: appendPath,
            pattern: `/* PLOP_INJECT_IMPORT */`,
            template: `import { {{pascalCase apiName}}Controller } from './{{dashCase folderName}}/{{dashCase apiName}}/{{dashCase apiName}}.controller';`,
          },
          {
            type: 'append',
            path: appendPath,
            pattern: `/* PLOP_INJECT_CONTROLLER */`,
            template: `\t\t{{pascalCase apiName}}Controller,`,
          },
          (answers, config, plop) => new Promise((resolve, reject) => {
            console.log('Running npm run format...');
            exec('npm run format', (error, stdout, stderr) => {
              if (error) {
                console.error(`Error executing npm run format: ${error}`);
                reject(error);
              } else if (stderr) {
                console.error(`stderr: ${stderr}`);
                resolve(stderr);  // Log stderr but don't fail the process
              } else {
                console.log('npm run format completed successfully!');
                console.log(stdout);
                resolve(stdout);
              }
            });
          })
        ];
      }
      else if (data.action === 'Delete') {
       
        return [
          {
            type: 'addMany',
            destination: destinationPath,
            base: '.templates/delete/',
            templateFiles: '.templates/delete/', // Make sure your template files are here
          },
          {
            type: 'append',
            path: appendPath,
            pattern: `/* PLOP_INJECT_IMPORT */`,
            template: `import { {{pascalCase apiName}}Controller } from './{{dashCase folderName}}/{{dashCase apiName}}/{{dashCase apiName}}.controller';`,
          },
          {
            type: 'append',
            path: appendPath,
            pattern: `/* PLOP_INJECT_CONTROLLER */`,
            template: `\t\t{{pascalCase apiName}}Controller,`,
          },
          (answers, config, plop) => new Promise((resolve, reject) => {
            console.log('Running npm run format...');
            exec('npm run format', (error, stdout, stderr) => {
              if (error) {
                console.error(`Error executing npm run format: ${error}`);
                reject(error);
              } else if (stderr) {
                console.error(`stderr: ${stderr}`);
                resolve(stderr);  // Log stderr but don't fail the process
              } else {
                console.log('npm run format completed successfully!');
                console.log(stdout);
                resolve(stdout);
              }
            });
          })
        ];
      }
      else if (data.action === 'All') {
        const excludeFields = [
          'createdBy',
          'updatedBy',
          'createdOn',
          'updatedOn',
        ];

        const fields = getModelFields(data.name, excludeFields);
        return [
          {
            type: 'addMany',
            destination: destinationPath,
            base: '.templates/all/',
            templateFiles: '.templates/all/', // Make sure your template files are here
            data: { fields },
          },
          {
            type: 'append',
            path: appendPath,
            pattern: `/* PLOP_INJECT_IMPORT */`,
            template: `
            import { Create{{pascalCase name}}Controller } from './{{dashCase folderName}}/create-{{dashCase name}}/create-{{dashCase name}}.controller';
            import { Update{{pascalCase name}}Controller } from './{{dashCase folderName}}/update-{{dashCase name}}/update-{{dashCase name}}.controller';
            import { Get{{pascalCase name}}ListController } from './{{dashCase folderName}}/get-{{dashCase name}}-list/get-{{dashCase name}}-list.controller';
            import { Get{{pascalCase name}}Controller } from './{{dashCase folderName}}/get-{{dashCase name}}/get-{{dashCase name}}.controller';
            import { Delete{{pascalCase name}}Controller } from './{{dashCase folderName}}/delete-{{dashCase name}}/delete-{{dashCase name}}.controller';
            `,
          },
          {
            type: 'append',
            path: appendPath,
            pattern: `/* PLOP_INJECT_CONTROLLER */`,
            template: `
            \t\tCreate{{pascalCase name}}Controller,
            \t\tUpdate{{pascalCase name}}Controller,
            \t\tGet{{pascalCase name}}ListController,
            \t\tGet{{pascalCase name}}Controller,
            \t\tDelete{{pascalCase name}}Controller,
            `,
          },
          (answers, config, plop) => new Promise((resolve, reject) => {
            console.log('Running npm run format...');
            exec('npm run format', (error, stdout, stderr) => {
              if (error) {
                console.error(`Error executing npm run format: ${error}`);
                reject(error);
              } else if (stderr) {
                console.error(`stderr: ${stderr}`);
                resolve(stderr);  // Log stderr but don't fail the process
              } else {
                console.log('npm run format completed successfully!');
                console.log(stdout);
                resolve(stdout);
              }
            });
          })
        ];
      }

    },

  });

  // other generators...
};
