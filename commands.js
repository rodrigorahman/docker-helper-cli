const commander  = require( 'commander');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawn;
const { prompt } = require('inquirer');
const fs =  require('fs');

const configFileName = './dhc-config.json';
const configExists = fs.existsSync(configFileName);

let defaultWebProjectName = '';
let appsEnableds = [
  {name: "ALL", checked: true}
];
let customCommandExec = [];

if(configExists){
  
  const config = JSON.parse(fs.readFileSync(configFileName, 'utf8'));
  defaultWebProjectName = config.defaultWebProjectName;
  
  appsEnableds.push(...config.appsEnabled)
  customCommandExec = config.customCommandExec || [];
}

appsEnableds.push({name: "Other"});

commander
  .version('0.0.1')
  .description('Utility to work with docker-compose at development time, many people use make to do this, but we can make it much better using nodejs');

commander
  .command('package')
  .alias('p')
  .description('Run mvn package for compile all projects in pom.xml')
  .action(async() => package())

commander
  .command('start')
  .alias('s')
  .option('-l, --log', 'tail in log after start')
  .description('Run mvn package for a compile all projects in pom.xml')
  .action(async(cmd) => {
    await package();
    await startStack()
    if(cmd.log){
      logApp(defaultWebProjectName)
    }
  })

commander
  .command('down')
  .alias('d')
  .description('Down Stack Development')
  .action(stopStack)

commander
  .command('rebuild-app [app]')
  .alias('r')
  .description('Do again a build of specific project')
  .action(async(app) => rebuildApp(app))

commander
  .command('log [app]')
  .alias('l')
  .description('Print logs')
  .action(async(app) => {
    if(!app){
      app = defaultWebProjectName;
    }
    logApp(app)
  })

commander
  .command('hot-deploy [app]')
  .alias('hd')
  .description('Hot Deploy app or defaultWebApp')
  .action(async(app) => {
    if(!app){
      app = defaultWebProjectName;
    }

    await rebuildApp(app);
    await logApp(app)
  })

if(customCommandExec.length > 0){
  customCommandExec.forEach(custom => {
    commander
      .command(custom.alias)
      .description(custom.description)
      .action(async() => {
        custom.command.forEach(async(c) => await commandExec(c))
      })
  })
}

commander.parse(process.argv);

async function package() {
  await commandExec('mvn package') 
}

async function clean() {
  await commandExec('mvn clean') 
}

async function startStack() {
  await commandExec('docker-compose up --build -d')
}

async function stopStack() {
  await commandExec('docker-compose down')
}

async function logApp(appName) {
  try{
    
    let responses = {};
    if(!appName){
      responses = await prompt([
        {
          type: 'input',
          name: 'app',
          message: 'What the App would you like showing logs?'
        }
      ]);
    }else{
      responses.app = appName;
    }
    
    let { app } = responses;

    commandSpawn(`docker-compose logs -f ${app}`)
    
    
  }catch(err) {
    console.error(err)
  }
}

async function rebuildApp(appName) {
  try{
    
    let responses = {};
    if(!appName){
      responses = await prompt([
        {
          type: 'list',
          name: 'app',
          message: 'Would you like rebuild ALL or Other apps ?',
          choices:  appsEnableds
        }
      ]);

      if(responses.app === 'Other'){
        responses = await prompt([
          {
            type: 'input',
            name: 'app',
            message: 'What the App name defined in docker compose ?'
          }
        ]);
      }

    }else{
      responses.app = appName;
    }
    
    let { app } = responses;

    if(app === 'ALL') app = '';
    
    await commandExec(`docker-compose stop -t 1 ${app}`);
    await clean();
    await package();
    await commandExec(`docker-compose build ${app}`);
    await commandExec(`docker-compose create ${app}`);
    await commandExec(`docker-compose start ${app}`);
    
  }catch(err) {
    console.error(err)
  }
}

async function commandExec(command) {
  console.log(command);
  let { err, stdout, stderr } = await exec(command);
  printlog(err, stdout, stderr);
}

async function commandSpawn(command){
  const commands = command.split(' ');
  const p = spawn(commands[0], commands.slice(1));
  p.stdout.setEncoding('utf8');
  p.stdout.on('data', (data) => console.log(data.slice(0,-2)));
}

async function printlog(err, stdout, stderr){
  if (err) {
    console.error(stderr);
    return;
  }
  console.log(stdout);
}