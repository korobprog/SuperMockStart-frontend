const API_URL = 'http://localhost:3001';

// Тестовый токен (замените на реальный)
const TEST_TOKEN = 'your-test-token-here';

async function testInterviewFlow() {
  console.log('🧪 Тестирование потока интервью...');

  try {
    // 1. Проверяем статус очереди
    console.log('\n1. Проверяем статус очереди...');
    const queueResponse = await fetch(`${API_URL}/api/calendar/queue/status`, {
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (queueResponse.ok) {
      const queueData = await queueResponse.json();
      console.log('✅ Статус очереди:', queueData);
    } else {
      console.log('❌ Ошибка получения статуса очереди');
    }

    // 2. Проверяем завершенные сессии
    console.log('\n2. Проверяем завершенные сессии...');
    const sessionsResponse = await fetch(`${API_URL}/api/calendar/sessions`, {
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (sessionsResponse.ok) {
      const sessionsData = await sessionsResponse.json();
      console.log('✅ Завершенные сессии:', sessionsData);
    } else {
      console.log('❌ Ошибка получения сессий');
    }

    // 3. Тестируем завершение сессии (если есть активная)
    console.log('\n3. Тестируем завершение сессии...');
    if (queueData && queueData.data && queueData.data.matchedSession) {
      const sessionId = queueData.data.matchedSession.id;
      const completeResponse = await fetch(
        `${API_URL}/api/calendar/sessions/${sessionId}/complete`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${TEST_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (completeResponse.ok) {
        console.log('✅ Сессия успешно завершена');
      } else {
        console.log('❌ Ошибка завершения сессии');
      }
    } else {
      console.log('ℹ️ Нет активных сессий для завершения');
    }
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

// Запускаем тест
testInterviewFlow();
