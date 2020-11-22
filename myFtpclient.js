const { fstat } = require('fs');
const net = require('net')
const readline = require('readline');
const fs = require('fs')

const client = new net.Socket()
const host = process.argv[2]
const port = process.argv[3]

let file = undefined

//'127.0.0.1'

client.connect(port, host, () => {
  console.log('Connected \n Bienvenue au client myFTP. \n Appuyez sur ENTER pour aller au menu.')
})

client.on('data', (data) => {
  const [directive, parameter] = data.toString().split(' ')

  switch(directive){

    case 'RETR':
      fs.writeFile('testdir/' + parameter, data.toString().replace('RETR ' + parameter + ' ', ''), err => {
        if (err) {
          console.error(err)
          return
        }
      })
      break

    default:
      console.log(data.toString())
      break
  }
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

//let authentified = false

rl.on('line', (line) => {

    console.clear();
    console.log("Menu : \n\nUSER <username> \nPASS <password> \nLIST \nCWD <directory> \nRETR <filename> \nSTOR <filename> \nPWD \nHELP \nQUIT")

    rl.question("\nchoisissez une commande : ", (line) => {

      const [directive, parameter] = line.split(' ')

      switch(directive){

        case 'USER':
          console.clear();
          client.write(line, 'utf8')
          console.log("Appuyez sur ENTER pour retourner au menu. ")
          break

        case 'PASS':
          console.clear();
          client.write(line, 'utf8')
          console.log("Appuyez sur ENTER pour retourner au menu. ")
          break

        case 'LIST':
          console.clear();
          client.write(line, 'utf8')
          console.log("Appuyez sur ENTER pour retourner au menu. ")
          break
        
        case 'CWD':
           console.clear();
           client.write(line, 'utf8')
           console.log("Appuyez sur ENTER pour retourner au menu. ")
          break

        case 'RETR':
          console.clear();
          client.write(line, 'utf8')
          console.log("Appuyez sur ENTER pour retourner au menu. ")
          break

        case 'STOR':  // copie dans /myFTP/testdir
            console.clear();
            if(fs.existsSync(parameter)){
              client.write('STOR '+ parameter + ' ' + fs.readFileSync(parameter, 'utf8'))
            }
            else{
              console.log(`Erreur ! ${parameter} n'esxiste pas.`)
            }
            console.log("Appuyez sur ENTER pour retourner au menu. ")
            break

        case 'PWD':
          console.clear();
          client.write(line, 'utf8')
          console.log("Appuyez sur ENTER pour retourner au menu. ")
          break

        case 'HELP':
          console.clear()
          console.log("USER <username>: check if the user exist\n"
          + "PASS <password>: authenticate the user with a password\n"
          + "LIST: list the current directory of the server\n"
          + "CWD <directory>: change the current directory of the server\n"
          + "RETR <filename>: transfer a copy of the file FILE from the server to the client\n"
          + "STOR <filename>: transfer a copy of the file FILE from the client to the server\n"
          + "PWD: display the name of the current directory of the server\n"
          + "HELP: send helpful information to the client\n"
          + "QUIT: close the connection and stop the program\n")
          console.log("Appuyez sur ENTER pour retourner au menu. ")
          break

        case 'QUIT':
          console.clear();
          client.write(line, 'utf8')
          rl.close()
          console.log("Goodbye \n")
          client.destroy()
          break
          
        default: 
          console.clear();
          console.log(directive)
          console.log("commande non reconnue. \n Appuyez sur ENTER pour retourner au menu. ")
          break
      }
    })
})

function menu(rl){
  console.clear()
  console.log("Menu : \n\nUSER \nPASS  \nLIST \nCWD \nRETER \nSTOR \nPWD \nHELP \nQUIT")
  /*const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })*/
  rl.question("\nchoisissez une option : ", (input) => {
    switch(input){
      case '1':
        console.log("option 1")
        //submenu(rl)
        rl.question("retournez au menu ? ", (input) => {
          //console.log('help')
        })
        menu(rl)
        break
      //default: menu()
    }
  })
}

/*function submenu(rl){
  rl.question("retournez au menu ? ", (input) => {
    console.log('help')
  })
  menu(rl)
}*/

//menu(rl)