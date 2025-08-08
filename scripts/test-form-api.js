#!/usr/bin/env node

// Тестовый скрипт для проверки API формы
const fetch = require('node-fetch');

const API_BASE = process.env.VITE_API_URL
  ? `${process.env.VITE_API_URL}/api`
  : 'http://localhost:3001/api';

async function testFormAPI() {
  console.log('🧪 Тестирование API формы...\n');

  try {
    // Тест 1: Проверка health endpoint
    console.log('1️⃣ Проверка health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData);
    console.log('');

    // Тест 2: Тест PUT /form (обновление формы)
    console.log('2️⃣ Тест обновления формы...');
    const formData = {
      profession: 'frontend-developer',
      country: 'Russia',
      language: 'ru',
      experience: '1-3 years',
      email: 'test@example.com',
      phone: '+7 999 123-45-67',
    };

    const formResponse = await fetch(`${API_BASE}/form`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token', // Тестовый токен
      },
      body: JSON.stringify(formData),
    });

    const formResult = await formResponse.json();
    console.log('📊 Статус ответа:', formResponse.status);
    console.log('📄 Ответ:', formResult);
    console.log('');

    // Тест 3: Тест GET /form (получение данных формы)
    console.log('3️⃣ Тест получения данных формы...');
    const getFormResponse = await fetch(`${API_BASE}/form`, {
      headers: {
        Authorization: 'Bearer test-token',
      },
    });

    const getFormResult = await getFormResponse.json();
    console.log('📊 Статус ответа:', getFormResponse.status);
    console.log('📄 Ответ:', getFormResult);
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  }
}

// Запуск теста
testFormAPI();
