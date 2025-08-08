import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestFormData() {
  try {
    console.log('🔍 Creating test form data...');

    // Проверяем подключение к базе данных
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Получаем тестового пользователя
    const testUser = await prisma.users.findUnique({
      where: { telegramId: '123456789' },
    });

    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }

    console.log('✅ Test user found:', {
      id: testUser.id,
      telegramId: testUser.telegramId,
      firstName: testUser.firstName,
    });

    // Проверяем, есть ли уже данные формы
    const existingFormData = await prisma.user_form_data.findFirst({
      where: { userId: testUser.id },
    });

    if (existingFormData) {
      console.log('✅ Form data already exists:', {
        id: existingFormData.id,
        profession: existingFormData.profession,
        language: existingFormData.language,
      });
      return;
    }

    // Создаем данные формы
    const formData = await prisma.user_form_data.create({
      data: {
        id: `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: testUser.id,
        profession: 'javascript',
        country: 'Russia',
        language: 'ru',
        experience: '1-3 years',
        email: 'test@example.com',
        phone: '+79001234567',
      },
    });

    console.log('✅ Form data created:', {
      id: formData.id,
      profession: formData.profession,
      language: formData.language,
      experience: formData.experience,
    });

    // Создаем выбранную профессию
    const selectedProfession = await prisma.selected_professions.create({
      data: {
        id: `profession-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        userId: testUser.id,
        profession: 'javascript',
      },
    });

    console.log('✅ Selected profession created:', {
      id: selectedProfession.id,
      profession: selectedProfession.profession,
    });

    console.log('✅ Test form data setup completed successfully');
  } catch (error) {
    console.error('❌ Error creating test form data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestFormData();
