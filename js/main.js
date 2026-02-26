document.addEventListener('DOMContentLoaded', function() {

    try {
	
	    // Создаем элемент прелоадера
        const preloader = document.createElement('div');
        preloader.className = 'custom-preloader';
        preloader.innerHTML = '<img src="images/preloader.gif" alt="Загрузка...">';
        document.getElementById('viewer').appendChild(preloader);
	
        const config = {
            default: {
                type: 'cubemap',
                autoLoad: true,
                compass: true,
                showZoomCtrl: false,
                keyboardZoom: false,
				mouseZoom: false, // Отключаем зум колесиком мыши
                mouseZoom: false,
                draggable: true,
                friction: 0.15,
                minPitch: -66,
				sceneFadeDuration: 800, // Длительность наплыва в миллисекундах (0,3 секунда)
				//preview: 'images/preview.jpg', // Превью-изображение для первой сцены
                hotSpots: []				
            },
            scenes: {
                'scene1': {
                    title: '',
                    cubeMap: [
                        'images/front.webp',
                        'images/right.webp',
                        'images/back.webp',
                        'images/left.webp',
                        'images/up.webp',
                        'images/down.webp'
                    ],
                    hotSpots: [
                        {
                            pitch: -29,           // Вертикальный угол
                            yaw: -365,               // Горизонтальный угол
                            type: 'scene',         // Тип - переход на другую сцену
                            text: 'Перейти во вторую панораму', // Текст подсказки
                            sceneId: 'scene2',     // ID целевой сцены
                            targetPitch: -20,        // Вертикальный угол после перехода (опционально)
                            targetYaw: 300,        // Горизонтальный угол после перехода (опционально)
                            targetHfov: 90         // Поле зрения после перехода (опционально)
                        }
                    ]
                },
                'scene2': {
                    title: '',
                    cubeMap: [
                        'images/front2.webp',
                        'images/right2.webp',
                        'images/back2.webp',
                        'images/left2.webp',
                        'images/up2.webp',
                        'images/down2.webp'
                    ],
                    hotSpots: [
                        {
                            pitch: -15,
                            yaw: -185,
                            type: 'scene',
                            text: 'Вернуться обратно',
                            sceneId: 'scene1',
                            targetPitch: -15,
                            targetYaw: 170,
                            targetHfov: 100
                        }
                    ]
                }
            },
            firstScene: 'scene1',
            strings: {
                loadButtonLabel: 'Загрузить',
                loadingLabel: 'Загрузка...',
                bylineLabel: '360° Панорама'
            }
        };
		
		// Устанавливаем белый фон для контейнера
        const container = document.getElementById('viewer');
        container.style.backgroundColor = '#ffffff';

        // Создаем просмотрщик
        const viewer = pannellum.viewer('viewer', config);

        // Сохраняем глобально для доступа
        window.pannellumViewer = viewer;
		
		// Убираем прелоадер после загрузки первой сцены
        viewer.on('load', function() {
            if (preloader && preloader.parentNode) {
                preloader.style.opacity = '0';
                setTimeout(function() {
                    if (preloader.parentNode) {
                        preloader.parentNode.removeChild(preloader);
                    }
                }, 500);
            }
            hideLoadBox();
        });

        // Находим и навсегда прячем стандартный load-box Pannellum
        function hideLoadBox() {
            const loadBox = document.querySelector('.pnlm-load-box');
            if (loadBox) {
                loadBox.style.display = 'none';
            }
        }

        // Прячем load-box при загрузке
        viewer.on('load', function() {
            hideLoadBox();
        });

        // Прячем load-box при смене сцены
        viewer.on('scenechange', function(id) {
            hideLoadBox();
        });

        // Прячем load-box после завершения наплыва
        viewer.on('scenechangefadedone', function(id) {
            hideLoadBox();
        });

        // Обработка ошибок
        viewer.on('error', function(error) {
            console.error('Ошибка:', error);
            hideLoadBox();
            if (preloader && preloader.parentNode) {
                preloader.innerHTML = '<p style="color: red; background: white; padding: 10px;">Ошибка загрузки</p>';
            }
        });

        // Дополнительно: каждые 100мс проверяем и прячем load-box
        //setInterval(hideLoadBox, 100);

        // Также прячем load-box сразу после создания
        setTimeout(hideLoadBox, 0);
        setTimeout(hideLoadBox, 100);
        setTimeout(hideLoadBox, 500);

    } catch (error) {
        console.error('Ошибка инициализации:', error);
        document.getElementById('viewer').innerHTML = '<p style="color: red; background: white; padding: 20px;">Ошибка: ' + error.message + '</p>';
    }
});