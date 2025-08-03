// Простой скрипт для тестирования API формы
// Запуск: node test-form-api.js

const API_BASE = 'http://localhost:3000/api';

// Замените на реальный токен из localStorage после авторизации через Telegram
const TEST_TOKEN = 'your-telegram-token-here';

async function testFormAPI() {
  console.log('🧪 Тестирование API формы...\n');

  // Тестовые данные
  const formData = {
    profession: 'frontend-developer',
    country: 'RU',
    experience: '1-3',
    email: 'test@example.com',
    phone: '+7 (999) 123-45-67',
  };

  try {
    // Тест 1: Отправка данных формы
    console.log('📤 Тест 1: Отправка данных формы');
    const saveResponse = await fetch(`${API_BASE}/form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
      body: JSON.stringify(formData),
    });

    console.log('Статус ответа:', saveResponse.status);

    if (saveResponse.ok) {
      const saveResult = await saveResponse.json();
      console.log('✅ Данные успешно сохранены:', saveResult);
    } else {
      const errorData = await saveResponse.json();
      console.log('❌ Ошибка сохранения:', errorData);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Тест 2: Получение данных формы
    console.log('📥 Тест 2: Получение данных формы');
    const getResponse = await fetch(`${API_BASE}/form`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
    });

    console.log('Статус ответа:', getResponse.status);

    if (getResponse.ok) {
      const getResult = await getResponse.json();
      console.log('✅ Данные успешно получены:', getResult);
    } else {
      const errorData = await getResponse.json();
      console.log('❌ Ошибка получения:', errorData);
    }
  } catch (error) {
    console.error('❌ Ошибка сети:', error.message);
  }
}

// Запуск тестов
testFormAPI();
