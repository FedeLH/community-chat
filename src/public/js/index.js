const socket = io()
let user
let chatBox = document.getElementById('chatBox')

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa el usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && '¡Necesitas escribir un nombre de usuario para continuar!'
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value
    indentified = true
    socket.emit('newUser', user)
})


socket.on('newUser', newUser => {
    if (user) {
        Swal.fire({
            text: `Nuevo usuario ${newUser} conectado`,
            toast: true,
            position: 'top-right'
        })
    }
})


chatBox.addEventListener('keyup', evt => {
    if(evt.key === 'Enter') {
        if(chatBox.value.trim().length > 0) {
            socket.emit('message', {user, message: chatBox.value})
            chatBox.value=''
        }
    }
})

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs')
    let messages = ''
    data.forEach(message => {
        let clase = 'receiver'
        if(message.user === user) clase = 'sender'
        messages = messages + `<p class="message ${clase}">${message.user} dice: ${message.message}</p>`
    })
    log.innerHTML = messages
})