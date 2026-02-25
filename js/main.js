document.addEventListener('DOMContentLoaded', function() {
    // Элемент для отображения информации
    /*const infoDiv = document.createElement('div');
    infoDiv.className = 'custom-info';
    infoDiv.innerHTML = '🏔️ 360° Панорама | Загрузка...';
    document.getElementById('viewer').appendChild(infoDiv);*/

    try {
        // Инициализация Pannellum
        const viewer = pannellum.viewer('viewer', {
            type: 'equirectangular',
            panorama: 'images/panorama.jpg',
            autoLoad: true,
            compass: true,
            northOffset: 0,
            showZoomCtrl: true,
            keyboardZoom: true,
            mouseZoom: true,
            draggable: true,
            friction: 0.15,
            hotSpots: [],
            strings: {
                loadButtonLabel: 'Нажмите для загрузки',
                loadingLabel: 'Загрузка...',
                bylineLabel: 'Панорама 360°'
            }
        });

        // Обновление информации при движении
        viewer.on('scenechange', function() {
            infoDiv.innerHTML = '🏔️ 360° Панорама | Используйте мышь для навигации';
        });

        viewer.on('error', function(error) {
            console.error('Ошибка:', error);
            infoDiv.innerHTML = '❌ Ошибка загрузки панорамы';
        });

        window.pannellumViewer = viewer;

    } catch (error) {
        console.error('Ошибка инициализации:', error);
        infoDiv.innerHTML = '❌ Ошибка: ' + error.message;
    }
});