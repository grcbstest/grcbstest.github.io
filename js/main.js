document.addEventListener('DOMContentLoaded', function() {

    try {
	
	    // Создаем элемент прелоадера
        const preloader = document.createElement('div');
        preloader.className = 'custom-preloader';
        preloader.innerHTML = '<img src="images/preloader.gif" alt="Загрузка...">';
        document.getElementById('viewer').appendChild(preloader);
        
        // Создаем кнопку для скрытия навигации
        const navButton = document.createElement('button');
        navButton.className = 'nav-toggle-button';
        navButton.textContent = 'Скрыть навигацию';
        navButton.style.position = 'absolute';
        navButton.style.bottom = '20px';
        navButton.style.right = '20px';
        navButton.style.zIndex = '1002';
        navButton.style.padding = '10px 20px';
        navButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        navButton.style.color = 'white';
        navButton.style.border = 'none';
        navButton.style.borderRadius = '30px';
        navButton.style.cursor = 'pointer';
        navButton.style.fontSize = '14px';
        navButton.style.backdropFilter = 'blur(5px)';
        navButton.style.transition = 'background-color 0.3s';
        document.getElementById('viewer').appendChild(navButton);
        
        // Состояние навигации (включена/выключена)
        let navigationVisible = true;
        // Флаг для предотвращения множественных перезагрузок
        let isReloading = false;
        // Текущая сцена
        let currentSceneId = 'scene1';
	
        const config = {
            default: {
                type: 'cubemap',
                autoLoad: true,
                compass: true,
                showZoomCtrl: false,
                keyboardZoom: false,
				mouseZoom: false,
                draggable: true,
                friction: 0.15,
                minPitch: -66,
				sceneFadeDuration: 800,
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
                            pitch: -0.35,
                            yaw: -369,
                            type: 'scene',
                            text: 'В путь',
                            sceneId: 'scene2',
                            targetPitch: -20,
                            targetYaw: 300,
                            targetHfov: 90,
                            cssClass: 'custom-hotspot-scene1',
							createTooltipArgs: 'Вторая панорама',
                            clickHandlerFunc: function(event, args) {
                                // Создаем дубликат хотспота при клике
                                createHotspotDuplicate(args.pitch, args.yaw, args.cssClass);
                            },
                            clickHandlerArgs: {
                                pitch: -0.35,
                                yaw: -369,
                                cssClass: 'custom-hotspot-scene1'
                            }
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
                            targetHfov: 100,
                            cssClass: 'custom-hotspot-scene2',
							createTooltipArgs: 'Основная панорама',
                            clickHandlerFunc: function(event, args) {
                                // Создаем дубликат хотспота при клике
                                createHotspotDuplicate(args.pitch, args.yaw, args.cssClass);
                            },
                            clickHandlerArgs: {
                                pitch: -15,
                                yaw: -185,
                                cssClass: 'custom-hotspot-scene2'
                            }
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
		
		// Функция для создания дубликата хотспота
        function createHotspotDuplicate(pitch, yaw, cssClass) {
            // Получаем позицию хотспота на экране
            if (!window.pannellumViewer) return;
            
            // Создаем дубликат
            const duplicate = document.createElement('div');
            duplicate.className = cssClass + ' hotspot-duplicate';
            
            // Устанавливаем стили для дубликата
            duplicate.style.position = 'absolute';
            duplicate.style.zIndex = '1001';
            duplicate.style.opacity = '1';
            duplicate.style.transition = 'opacity 0.5s ease';
            
            // Добавляем дубликат в DOM
            document.getElementById('viewer').appendChild(duplicate);
            
            // Функция обновления позиции дубликата
            function updateDuplicatePosition() {
                if (!window.pannellumViewer || !duplicate.parentNode) return;
                
                try {
                    // Получаем координаты хотспота на экране через API Pannellum
                    const originalHotspots = document.querySelectorAll('.' + cssClass);
                    if (originalHotspots.length > 0) {
                        const original = originalHotspots[0];
                        const rect = original.getBoundingClientRect();
                        duplicate.style.left = rect.left + 'px';
                        duplicate.style.top = rect.top + 'px';
                        duplicate.style.width = rect.width + 'px';
                        duplicate.style.height = rect.height + 'px';
                    }
                } catch (e) {
                    console.error('Ошибка позиционирования дубликата:', e);
                }
            }
            
            // Обновляем позицию
            updateDuplicatePosition();
            
            // Запускаем исчезновение через небольшую задержку
            setTimeout(function() {
                duplicate.style.opacity = '0';
            }, 10);
            
            // Удаляем дубликат после завершения анимации
            setTimeout(function() {
                if (duplicate && duplicate.parentNode) {
                    duplicate.parentNode.removeChild(duplicate);
                }
            }, 510);
        }
        
        // Функция для скрытия/показа хотспотов
        function toggleHotspotsVisibility(hide) {
            const hotspots = document.querySelectorAll('.custom-hotspot-scene1, .custom-hotspot-scene2');
            hotspots.forEach(function(hotspot) {
                if (hide) {
                    hotspot.style.display = 'none';
                } else {
                    hotspot.style.display = '';
                }
            });
        }
        
        // Функция для замены изображения front.webp на front_mask.webp и обратно
        function toggleNavigation() {
            if (!window.pannellumViewer || isReloading) return;
            
            isReloading = true;
            
            // Получаем текущую сцену
            const currentScene = window.pannellumViewer.getScene();
            
            if (navigationVisible) {
                // Скрываем навигацию - заменяем front.webp на front_mask.webp
                if (currentScene === 'scene1') {
                    // Для первой сцены
                    config.scenes.scene1.cubeMap[0] = 'images/front_mask.webp';
                } else if (currentScene === 'scene2') {
                    // Для второй сцены
                    config.scenes.scene2.cubeMap[0] = 'images/front_mask.webp';
                }
                
                // Скрываем хотспоты
                toggleHotspotsVisibility(true);
                
                // Обновляем кнопку
                navButton.textContent = 'Включить навигацию';
                navigationVisible = false;
            } else {
                // Включаем навигацию - возвращаем front.webp
                if (currentScene === 'scene1') {
                    // Для первой сцены
                    config.scenes.scene1.cubeMap[0] = 'images/front.webp';
                } else if (currentScene === 'scene2') {
                    // Для второй сцены
                    config.scenes.scene2.cubeMap[0] = 'images/front2.webp';
                }
                
                // Показываем хотспоты
                toggleHotspotsVisibility(false);
                
                // Обновляем кнопку
                navButton.textContent = 'Скрыть навигацию';
                navigationVisible = true;
            }
            
            // Перезагружаем текущую сцену с обновленным изображением
            const currentPitch = window.pannellumViewer.getPitch();
            const currentYaw = window.pannellumViewer.getYaw();
            const currentHfov = window.pannellumViewer.getHfov();
            
            window.pannellumViewer.loadScene(currentScene, currentPitch, currentYaw, currentHfov);
            
            // Сбрасываем флаг через небольшую задержку
            setTimeout(function() {
                isReloading = false;
            }, 1000);
        }
        
        // Добавляем обработчик клика на кнопку
        navButton.addEventListener('click', toggleNavigation);
		
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

        // Прячем load-box при смене сцены
        viewer.on('scenechange', function(id) {
            currentSceneId = id;
            hideLoadBox();
            
            // При смене сцены применяем текущее состояние видимости хотспотов
            setTimeout(function() {
                if (!navigationVisible) {
                    toggleHotspotsVisibility(true);
                }
            }, 100);
        });

        // Обработка ошибок
        viewer.on('error', function(error) {
            console.error('Ошибка:', error);
            hideLoadBox();
            if (preloader && preloader.parentNode) {
                preloader.innerHTML = '<p style="color: red; background: white; padding: 10px;">Ошибка загрузки</p>';
            }
        });

        // Также прячем load-box сразу после создания
        setTimeout(hideLoadBox, 0);
        setTimeout(hideLoadBox, 100);
        setTimeout(hideLoadBox, 500);

    } catch (error) {
        console.error('Ошибка инициализации:', error);
        document.getElementById('viewer').innerHTML = '<p style="color: red; background: white; padding: 20px;">Ошибка: ' + error.message + '</p>';
    }
});