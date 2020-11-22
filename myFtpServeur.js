const net = require('net')
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const { Console } = require('console');
const { argv } = require('process');

fs.chmod('forbidden', 0o000, (err) => {  // ne marche pas
  if (err) throw err;
});

const port = process.argv[2]

const server = net.createServer((socket) => {

  console.log('new connection')

  let CurrentUser = undefined
  let CurrentLine = 0
  let CurrentDir = undefined
  let file = undefined

  const users = fs.readFileSync('./users.json', 'utf8')
  const lines = users.split(/\r?\n/)

  socket.on('data', (data) => {

    const [directive, parameter] = data.toString().split(' ')
    
    switch(directive) {

        case 'USER':
          CurrentLine = 0
            for(let i = 0; i < lines.length; i++){
              if(lines[i].match(parameter)){
                CurrentUser = parameter
                CurrentLine = i
                socket.write(`${CurrentUser} est dans la base de donnée`)
                break
              }
            }
            if(CurrentUser != parameter){
              socket.write(`${parameter} n'est pas dans la base de donnée`)
            }
            break;

        case 'PASS':
          if(CurrentUser != undefined){
            if(lines[CurrentLine + 1].match(parameter)){
              socket.write(`${CurrentUser} est identifié`)
            }
            else{
                socket.write(`mot de passe incorrect pour ${CurrentUser}`)
            }
          }
          else{
            socket.write(`Selectionner d'abord un utilisateur`)
          }
          break

        case 'LIST':
          fs.readdirSync(process.cwd()).forEach(file => {
            socket.write('\n' + file)
          })
          break

        case 'CWD':
          CurrentDir = process.cwd()
          try {
            process.chdir(parameter)
            if(process.cwd() == CurrentDir){
              socket.write(`L'acces à ${parameter} est interdit`)
            }
            else{
              socket.write(`The new working directory is ${process.cwd()}`)
            }
          } catch (err) {
            console.error(`chdir: ${err}`);
            socket.write(`chdir: ${err}`)
          }
          
          break

        case 'RETR':
          if(fs.existsSync(parameter)){
            file = fs.readFileSync(parameter, 'utf8')
            socket.write('RETR ' + parameter + ' ' + file)
            socket.write(`${parameter} a été copié dans /myFTP/testdir`)
          }
          else{
            socket.write(`Erreur ! ${parameter} n'esxiste pas.`)
          }
          break

        case 'STOR':
          fs.writeFile(parameter, data.toString().replace('RETR ' + parameter + ' ', ''), err => {
            if (err) {
              console.error(err)
              return
            }
          })
          socket.write(`${parameter} a été copié dans ${process.cwd()}`)
          break

        case 'PWD':
          socket.write(process.cwd())
          break

        case 'QUIT':
          console.log("Server is shutting down \n")
          server.close()
          break

        default:
          console.log("erreur commande non reconnue")
          break

    }
  })
})

server.listen(port, () => {
  console.log(`Server started at port ${port}`)
})