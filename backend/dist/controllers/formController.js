import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
export const saveFormData = async (req, res) => {
    try {
        const { profession, country, language, experience, email, phone, } = req.body;
        const userId = req.extendedUser?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized - User ID not found',
            });
        }
        // Валидация обязательных полей
        if (!profession || !country || !language || !experience) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: profession, country, language, experience',
            });
        }
        // Находим пользователя по userId (database ID)
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }
        // Сохраняем выбранную профессию
        await prisma.selectedProfession.create({
            data: {
                userId: user.id,
                profession,
            },
        });
        // Сохраняем полные данные формы
        await prisma.userFormData.create({
            data: {
                userId: user.id,
                profession,
                country,
                language,
                experience,
                email,
                phone,
            },
        });
        // НЕ обновляем статус пользователя - оставляем как есть (INTERVIEWER по умолчанию)
        // Статус CANDIDATE устанавливается только после получения обратной связи
        res.status(200).json({
            success: true,
            message: 'Form data saved successfully',
            data: {
                profession,
                country,
                experience,
                email,
                phone,
            },
        });
    }
    catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};
export const updateFormData = async (req, res) => {
    try {
        const { profession, country, language, experience, email, phone, } = req.body;
        const userId = req.extendedUser?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized - User ID not found',
            });
        }
        // Валидация обязательных полей
        if (!profession || !country || !language || !experience) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: profession, country, language, experience',
            });
        }
        // Находим пользователя по userId
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }
        // Создаем новую запись профессии (история выбора)
        await prisma.selectedProfession.create({
            data: {
                userId: user.id,
                profession,
            },
        });
        // Обновляем или создаем данные формы
        const existingFormData = await prisma.userFormData.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });
        if (existingFormData) {
            await prisma.userFormData.update({
                where: { id: existingFormData.id },
                data: {
                    profession,
                    country,
                    language,
                    experience,
                    email,
                    phone,
                },
            });
        }
        else {
            await prisma.userFormData.create({
                data: {
                    userId: user.id,
                    profession,
                    country,
                    language,
                    experience,
                    email,
                    phone,
                },
            });
        }
        res.status(200).json({
            success: true,
            message: 'Form data updated successfully',
            data: {
                profession,
                country,
                language,
                experience,
                email,
                phone,
            },
        });
    }
    catch (error) {
        console.error('Error updating form data:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};
export const getFormData = async (req, res) => {
    try {
        const userId = req.extendedUser?.id;
        console.log('🔍 getFormData - userId:', userId);
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized - User ID not found',
            });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                selectedProfessions: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                formData: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
        console.log('🔍 getFormData - user found:', !!user);
        console.log('🔍 getFormData - user.formData:', user?.formData);
        console.log('🔍 getFormData - user.selectedProfessions:', user?.selectedProfessions);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }
        const latestProfession = user.selectedProfessions[0];
        const latestFormData = user.formData[0];
        // Проверяем, может ли пользователь быть кандидатом (получал ли он обратную связь)
        const feedbackReceived = await prisma.feedback.findFirst({
            where: {
                toUserId: user.id,
            },
        });
        const canBeCandidate = feedbackReceived !== null;
        res.status(200).json({
            success: true,
            data: {
                profession: latestProfession?.profession || null,
                language: latestFormData?.language || 'en',
                country: latestFormData?.country || null,
                experience: latestFormData?.experience || null,
                email: latestFormData?.email || null,
                phone: latestFormData?.phone || null,
                status: user.status || 'INTERVIEWER', // По умолчанию INTERVIEWER
                canBeCandidate,
            },
        });
    }
    catch (error) {
        console.error('Error getting form data:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};
//# sourceMappingURL=formController.js.map