// Тест end-to-end для формы
// Запуск: node test-form-end-to-end.js

const API_BASE = 'http://localhost:3001/api';

async function testFormEndToEnd() {
  console.log('🧪 Тестирование формы end-to-end...\n');

  try {
    // Шаг 1: Получаем тестовый токен
    console.log('📤 Шаг 1: Получение тестового токена');
    const tokenResponse = await fetch(`${API_BASE}/auth/test-token`);

    if (!tokenResponse.ok) {
      throw new Error(`Ошибка получения токена: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.data.token;
    console.log('✅ Тестовый токен получен');

    // Шаг 2: Отправляем данные формы
    console.log('\n📤 Шаг 2: Отправка данных формы');
    const formData = {
      profession: 'frontend-developer',
      country: 'RU',
      experience: '1-3',
      email: 'test@example.com',
      phone: '+7 (999) 123-45-67',
    };

    const formResponse = await fetch(`${API_BASE}/form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!formResponse.ok) {
      const errorData = await formResponse.json();
      throw new Error(
        `Ошибка отправки формы: ${errorData.error || formResponse.status}`
      );
    }

    const formResult = await formResponse.json();
    console.log('✅ Форма успешно отправлена:', formResult);

    // Шаг 3: Получаем данные формы
    console.log('\n📥 Шаг 3: Получение данных формы');
    const getResponse = await fetch(`${API_BASE}/form`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!getResponse.ok) {
      const errorData = await getResponse.json();
      throw new Error(
        `Ошибка получения данных: ${errorData.error || getResponse.status}`
      );
    }

    const getResult = await getResponse.json();
    console.log('✅ Данные формы успешно получены:', getResult);

    console.log('\n🎉 Все тесты прошли успешно!');
    console.log('📋 Результаты:');
    console.log(`   - Токен: ${token.substring(0, 20)}...`);
    console.log(`   - Профессия: ${formData.profession}`);
    console.log(`   - Страна: ${formData.country}`);
    console.log(`   - Опыт: ${formData.experience}`);
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
    process.exit(1);
  }
}

// Запуск тестов
testFormEndToEnd();
