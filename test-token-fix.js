// Тестовый скрипт для проверки исправления токенов
const API_URL = 'http://localhost:3001';

// Тестовый extended_token (замените на реальный токен пользователя)
const TEST_EXTENDED_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQ1Njc4OSwidXNlcm5hbWUiOiJ0ZXN0X3VzZXIiLCJmaXJzdE5hbWUiOiJUZXN0IiwibGFzdE5hbWUiOiJVc2VyIiwiYXV0aFR5cGUiOiJ0ZWxlZ3JhbSIsInVzZXJEYklkIjoxLCJpYXQiOjE3NTQyODY5ODAsImV4cCI6MTc1NDg5MTc4MH0.example';

async function testCalendarEndpoints() {
  console.log('🧪 Тестирование календарных эндпоинтов...');

  try {
    // Тест 1: Получение доступных слотов
    console.log('\n1. Тестирование GET /api/calendar/slots/frontend-developer');
    const slotsResponse = await fetch(
      `${API_URL}/api/calendar/slots/frontend-developer`,
      {
        headers: {
          Authorization: `Bearer ${TEST_EXTENDED_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Статус ответа:', slotsResponse.status);
    if (slotsResponse.ok) {
      const slotsData = await slotsResponse.json();
      console.log(
        '✅ Слоты получены успешно:',
        slotsData.data?.length || 0,
        'слотов'
      );
    } else {
      const errorData = await slotsResponse.text();
      console.log('❌ Ошибка получения слотов:', errorData);
    }

    // Тест 2: Получение статуса очереди
    console.log('\n2. Тестирование GET /api/calendar/queue/status');
    const queueResponse = await fetch(`${API_URL}/api/calendar/queue/status`, {
      headers: {
        Authorization: `Bearer ${TEST_EXTENDED_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Статус ответа:', queueResponse.status);
    if (queueResponse.ok) {
      const queueData = await queueResponse.json();
      console.log('✅ Статус очереди получен:', queueData.data);
    } else {
      const errorData = await queueResponse.text();
      console.log('❌ Ошибка получения статуса очереди:', errorData);
    }

    // Тест 3: Получение сессий пользователя
    console.log('\n3. Тестирование GET /api/calendar/sessions');
    const sessionsResponse = await fetch(`${API_URL}/api/calendar/sessions`, {
      headers: {
        Authorization: `Bearer ${TEST_EXTENDED_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Статус ответа:', sessionsResponse.status);
    if (sessionsResponse.ok) {
      const sessionsData = await sessionsResponse.json();
      console.log(
        '✅ Сессии получены успешно:',
        sessionsData.data?.length || 0,
        'сессий'
      );
    } else {
      const errorData = await sessionsResponse.text();
      console.log('❌ Ошибка получения сессий:', errorData);
    }
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

async function testFeedbackEndpoints() {
  console.log('\n🧪 Тестирование эндпоинтов обратной связи...');

  try {
    // Тест: Получение отзывов пользователя
    console.log('\n1. Тестирование GET /api/feedback/user?type=received');
    const feedbackResponse = await fetch(
      `${API_URL}/api/feedback/user?type=received`,
      {
        headers: {
          Authorization: `Bearer ${TEST_EXTENDED_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Статус ответа:', feedbackResponse.status);
    if (feedbackResponse.ok) {
      const feedbackData = await feedbackResponse.json();
      console.log(
        '✅ Отзывы получены успешно:',
        feedbackData.data?.length || 0,
        'отзывов'
      );
    } else {
      const errorData = await feedbackResponse.text();
      console.log('❌ Ошибка получения отзывов:', errorData);
    }
  } catch (error) {
    console.error('❌ Ошибка тестирования отзывов:', error);
  }
}

// Запускаем тесты
async function runTests() {
  console.log('🚀 Запуск тестов исправления токенов...\n');

  await testCalendarEndpoints();
  await testFeedbackEndpoints();

  console.log('\n✅ Тестирование завершено!');
  console.log('\n📝 Инструкции для тестирования:');
  console.log('1. Замените TEST_EXTENDED_TOKEN на реальный токен пользователя');
  console.log('2. Запустите скрипт: node test-token-fix.js');
  console.log('3. Проверьте, что все эндпоинты возвращают успешные ответы');
}

runTests();
