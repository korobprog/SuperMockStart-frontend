import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkFormData() {
  try {
    console.log('🔍 Проверка данных формы в базе данных...\n');

    // Проверяем пользователей
    console.log('👥 Пользователи:');
    const users = await prisma.user.findMany({
      include: {
        selectedProfessions: true,
        formData: true,
      },
    });

    users.forEach((user) => {
      console.log(`- ID: ${user.id}`);
      console.log(`  Telegram ID: ${user.telegramId}`);
      console.log(`  Имя: ${user.firstName} ${user.lastName}`);
      console.log(`  Статус: ${user.status}`);
      console.log(`  Выбранные профессии: ${user.selectedProfessions.length}`);
      console.log(`  Данные формы: ${user.formData.length}`);
      console.log('');
    });

    // Проверяем данные формы
    console.log('📋 Данные формы:');
    const formData = await prisma.userFormData.findMany({
      include: {
        user: true,
      },
    });

    formData.forEach((data) => {
      console.log(`- ID: ${data.id}`);
      console.log(
        `  Пользователь: ${data.user.firstName} ${data.user.lastName}`
      );
      console.log(`  Профессия: ${data.profession}`);
      console.log(`  Страна: ${data.country}`);
      console.log(`  Опыт: ${data.experience}`);
      console.log(`  Email: ${data.email || 'не указан'}`);
      console.log(`  Телефон: ${data.phone || 'не указан'}`);
      console.log(`  Дата создания: ${data.createdAt}`);
      console.log('');
    });

    // Проверяем выбранные профессии
    console.log('💼 Выбранные профессии:');
    const professions = await prisma.selectedProfession.findMany({
      include: {
        user: true,
      },
    });

    professions.forEach((prof) => {
      console.log(`- ID: ${prof.id}`);
      console.log(
        `  Пользователь: ${prof.user.firstName} ${prof.user.lastName}`
      );
      console.log(`  Профессия: ${prof.profession}`);
      console.log(`  Дата выбора: ${prof.createdAt}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Ошибка при проверке данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFormData();
