const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSessions() {
  try {
    const sessions = await prisma.interviewSession.findMany({
      include: {
        candidate: true,
        interviewer: true,
      },
    });

    console.log('Sessions:', JSON.stringify(sessions, null, 2));

    if (sessions.length === 0) {
      console.log('No sessions found in database');
    } else {
      console.log(`Found ${sessions.length} sessions`);
      sessions.forEach((session, index) => {
        console.log(`${index + 1}. Session ID: ${session.id}`);
        console.log(`   Status: ${session.status}`);
        console.log(`   Profession: ${session.profession}`);
        console.log(
          `   Candidate: ${session.candidate.firstName} ${session.candidate.lastName}`
        );
        console.log(
          `   Interviewer: ${session.interviewer.firstName} ${session.interviewer.lastName}`
        );
        console.log('---');
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSessions();
