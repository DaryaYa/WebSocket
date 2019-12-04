function wait (delay) {
    return new Promise((r) => setTimeout(r, delay));
}

const messages = document.querySelector('.messages');
const input = document.querySelector('.input');

if(Notification.permission !== 'granted') {
    Notification.requestPermission();
}

function onMessage (e) {
    const { data } = e;
    const msgs = JSON.parse(data);

    if (document.hidden && Notification.permission === 'granted') {
        new Notification('New Message');
    }

    const fragment = document.createDocumentFragment();

    msgs.forEach(({ from, message }) => {
        const msgElement = document.createElement('div');
        msgElement.innerHTML = `${from}: ${message}`;
        fragment.appendChild(msgElement);
    });

    messages.appendChild(fragment);

}

let ws = new WebSocket('ws://chat.shas.tel');

function onOpen () {
    ws.addEventListener('close', onClose);
    ws.addEventListener('message', onMessage);

      document.addEventListener('keydown', (e) => {
        if(e.keyCode !== 13) {
            return;
        } 

        const text = input.value;

        if(!text) {
            return;
        }

        const message = {
            from: 'Darya',
            message: text,
        }
        input.value = '';

        ws.send(JSON.stringify(message));
    });

    input.removeAttribute('disabled');   
}

async function onClose () {
    ws.removeEventListener('open', onOpen);
    ws.removeEventListener('close', onClose);
    ws.removeEventListener('message', onMessage);

    await wait(2000);

    ws = new WebSocket('ws://chat.shas.tel');
    ws.addEventListener('close', onClose);
    ws.addEventListener('open', onOpen);
}



ws.addEventListener('open', onOpen);

  



// ws.onopen = function() {
//     ws.send('Hello Socket');
// }

// ws.onmessage = function(e) {
//     console.log(e.data)
// }

// socket.binaryType = 'arraybuffer';
