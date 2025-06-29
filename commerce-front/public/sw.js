    self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};

    const title = data.title || 'Nova Notificação';
    const options = {
        body: data.message || 'Você tem uma nova notificação.',
        icon: '/icons/icon.png',
        badge: '/icons/icon.png',
        vibrate: [200, 100, 200], // padrão de vibração: vibrar 200ms, pausa 100ms, vibrar 200ms
        sound: 'public/sounds/notification.mp3', // OBS: som em notificações push nem sempre funciona no navegador, mas colocamos
        actions: [
        {
            action: 'open_admin',
            title: 'Abrir painel',
            icon: '/icons/open-icon.png' // coloque um ícone menor para a ação
        },
        {
            action: 'dismiss',
            title: 'Fechar',
            icon: '/icons/close-icon.png'
        }
        ],
        data: {
        urlToOpen: '/admin' // url para usar na ação de abrir
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
    });

    self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'open_admin') {
        // Ação clicada: abrir painel admin
        event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
            if (client.url.includes('/admin') && 'focus' in client) {
                return client.focus();
            }
            }
            if (clients.openWindow) {
            return clients.openWindow(event.notification.data.urlToOpen);
            }
        })
        );
    } else if (event.action === 'dismiss') {
        // Ação clicada: só fecha a notificação
        // Nenhuma ação extra necessária
    } else {
        // Se clicar fora das ações (no corpo da notificação)
        event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
            if (client.url.includes('/admin') && 'focus' in client) {
                return client.focus();
            }
            }
            if (clients.openWindow) {
            return clients.openWindow(event.notification.data.urlToOpen);
            }
        })
        );
    }
    });
