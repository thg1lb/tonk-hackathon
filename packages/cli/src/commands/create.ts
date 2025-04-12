import {Command} from 'commander';
import child_process from 'child_process';

export const createCommand = new Command('create')
  .description('Create a new tonk application or component')
  .option('-i, --init', 'initialize in the folder')
  .action(options => {
    try {
      // Build the command with any passed options
      const createCommand = `npx @tonk/create ${options.init ? '-i' : ''}`;

      console.log(createCommand);

      // Execute the create package
      child_process.execSync(createCommand, {
        stdio: 'inherit',
        env: {...process.env},
      });

      process.exit(0);
    } catch (error: any) {
      if (error.status === 8) {
        console.error('Failed to generate Tonk code:', error);
      } else {
        console.error('Failed to generate Tonk code:', error);
      }
      process.exit(1);
    }
  });
