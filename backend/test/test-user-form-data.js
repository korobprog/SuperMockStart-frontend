import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testUserFormData() {
  try {
    console.log('🔍 Testing user form data...');

    // Проверяем подключение к базе данных
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Получаем тестового пользователя
    const testUser = await prisma.users.findUnique({
      where: { telegramId: '123456789' },
      include: {
        user_form_data: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        selected_professions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }

    console.log('✅ Test user found:', {
      id: testUser.id,
      telegramId: testUser.telegramId,
      firstName: testUser.firstName,
      role: testUser.role,
      status: testUser.status,
    });

    console.log('📋 User form data count:', testUser.user_form_data.length);
    console.log(
      '📋 User selected professions count:',
      testUser.selected_professions.length
    );

    if (testUser.user_form_data.length > 0) {
      const latestFormData = testUser.user_form_data[0];
      console.log('✅ Latest form data found:', {
        id: latestFormData.id,
        profession: latestFormData.profession,
        country: latestFormData.country,
        language: latestFormData.language,
        experience: latestFormData.experience,
        createdAt: latestFormData.createdAt,
      });
    } else {
      console.log('❌ No form data found for user');
    }

    if (testUser.selected_professions.length > 0) {
      console.log('✅ Selected professions:');
      testUser.selected_professions.forEach((prof, index) => {
        console.log(`  ${index + 1}. ${prof.profession} (${prof.createdAt})`);
      });
    } else {
      console.log('❌ No selected professions found');
    }

    // Проверяем, есть ли данные формы для других пользователей
    const allFormData = await prisma.user_form_data.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        users: {
          select: {
            id: true,
            telegramId: true,
            firstName: true,
          },
        },
      },
    });

    console.log('📊 Total form data entries in database:', allFormData.length);
    allFormData.forEach((formData, index) => {
      console.log(
        `  ${index + 1}. ${formData.profession} - ${formData.language} (${
          formData.users?.firstName || 'Unknown'
        })`
      );
    });
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserFormData();
