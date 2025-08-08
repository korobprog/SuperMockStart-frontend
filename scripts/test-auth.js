#!/usr/bin/env node

// Тестовый скрипт для проверки аутентификации
const fetch = require('node-fetch');

const API_BASE = process.env.VITE_API_URL
  ? `${process.env.VITE_API_URL}/api`
  : 'http://localhost:3001/api';

async function testAuth() {
  console.log('🧪 Тестирование аутентификации...\n');

  try {
    // Тест 1: Получение тестового токена
    console.log('1️⃣ Получение тестового токена...');
    const testTokenResponse = await fetch(`${API_BASE}/auth/test-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const testTokenData = await testTokenResponse.json();
    console.log('📊 Статус ответа:', testTokenResponse.status);
    console.log('📄 Ответ:', testTokenData);

    if (!testTokenData.success || !testTokenData.data?.token) {
      console.log('❌ Не удалось получить тестовый токен');
      return;
    }

    const token = testTokenData.data.token;
    console.log('✅ Получен токен:', token.substring(0, 20) + '...');
    console.log('');

    // Тест 2: Проверка токена
    console.log('2️⃣ Проверка токена...');
    const verifyResponse = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const verifyData = await verifyResponse.json();
    console.log('📊 Статус ответа:', verifyResponse.status);
    console.log('📄 Ответ:', verifyData);
    console.log('');

    // Тест 3: Проверка расширенного токена
    console.log('3️⃣ Проверка расширенного токена...');
    const verifyExtendedResponse = await fetch(
      `${API_BASE}/auth/verify-extended-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const verifyExtendedData = await verifyExtendedResponse.json();
    console.log('📊 Статус ответа:', verifyExtendedResponse.status);
    console.log('📄 Ответ:', verifyExtendedData);
    console.log('');

    // Тест 4: Проверка API формы с токеном
    console.log('4️⃣ Проверка API формы с токеном...');
    const formResponse = await fetch(`${API_BASE}/form`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const formData = await formResponse.json();
    console.log('📊 Статус ответа:', formResponse.status);
    console.log('📄 Ответ:', formData);
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  }
}

// Запуск теста
testAuth();
