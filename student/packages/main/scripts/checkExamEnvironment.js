import os from 'os';
import fs from 'fs';

/**
 * Verifies that the application is running inside
 * a Puavo OS exam session. Silently exits if not.
 * Skipped in development builds.
 */
export function checkExamEnvironment(development) {
    if (development) {
        return;
    }

    // Must be running as the dedicated exam user
    const username = os.userInfo().username;
    if (username !== 'puavo-examuser') {
        process.exit(0);
    }

    // Exam session file must exist and indicate
    // an active Next Exam session
    const sessionPath =
        '/var/lib/puavo-exammode/session.json';

    try {
        const content =
            fs.readFileSync(sessionPath, 'utf8');
        const session = JSON.parse(content);

        if (session.type !== 'next-exam-session') {
            process.exit(0);
        }
    } catch (error) {
        process.exit(0);
    }

    // Exam session runs on a dedicated X display
    if (process.env.DISPLAY !== ':42') {
        process.exit(0);
    }
}
