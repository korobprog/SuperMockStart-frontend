async function testPost() {
  try {
    // Сначала получаем токен
    console.log('Получаем токен...');
    const tokenResponse = await fetch(
      'http://localhost:5173/api/auth/test-token'
    );
    const tokenData = await tokenResponse.json();

    if (!tokenData.success) {
      throw new Error(`Ошибка получения токена: ${tokenData.error}`);
    }

    const token = tokenData.data.token;
    console.log('Токен получен:', token.substring(0, 20) + '...');

    // Теперь отправляем форму
    console.log('Отправляем форму...');
    const formData = {
      profession: 'frontend-developer',
      country: 'RU',
      experience: '1-3',
      email: 'test@example.com',
      phone: '+7 (999) 123-45-67',
    };

    const formResponse = await fetch('http://localhost:5173/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    console.log('Статус ответа:', formResponse.status);

    if (!formResponse.ok) {
      const errorText = await formResponse.text();
      throw new Error(`HTTP ${formResponse.status}: ${errorText}`);
    }

    const formResult = await formResponse.json();
    console.log('Результат:', formResult);

    console.log('✅ Успешно! Форма отправлена');
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testPost();
