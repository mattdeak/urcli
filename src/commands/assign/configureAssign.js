// npm modules
import inquirer from 'inquirer';
// our modules
import env from './assignConfig';
import selectOptions from './selectOptions';
import selectScripts from './selectScripts';
import selectDefaultProjects from './selectDefaultProjects';
import {config} from '../../utils';

// Initialize by setting all options to the default.
config.assign = config.assign || {};
config.assign.flags = config.assign.flags || env.flags;
config.assign.scripts = config.assign.scripts || {};
config.assign.default = config.assign.default || [];

const configureAssign = async () => {
  // Ask which options to configure.
  const selection = await inquirer.prompt([{
    type: 'list',
    message: 'Which options do you want to configure?',
    name: 'opt',
    choices: [
      {
        name: 'Configure the UI',
        value: 'ui',
      },
      {
        name: 'Configure the Request',
        value: 'projects',
      },
      {
        name: 'Configure Scripts',
        value: 'scripts',
      },
      new inquirer.Separator(),
      {
        name: 'Exit',
        value: 'exit',
      },
    ],
  }]);

  const selected = selection.opt;
  if (selected === 'exit') {
    // Make sure the ui flag is always set to true
    config.assign.flags.ui = true;
    config.save();
    console.log('Configuration saved!');
    process.exit(0);
  } else {
    if (selected === 'ui') {
      const ui = await selectOptions();
      Object.keys(config.assign.flags).forEach((flag) => {
        if (ui.options.includes(flag)) {
          config.assign.flags[flag] = true;
        } else {
          config.assign.flags[flag] = false;
        }
      });
    } else if (selected === 'projects') {
      config.assign.default = await selectDefaultProjects();
    } else {
      config.assign.scripts = await selectScripts();
    }
    await configureAssign();
  }
};

export default configureAssign;
