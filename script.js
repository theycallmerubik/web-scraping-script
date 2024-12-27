import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function deleteSchedulesExceptMonday() {
    try {
        const response = await fetch('https://api.apify.com/v2/schedules', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.APIFY_TOKEN}`,
            },
        });
        const schedules = await response.json();
        for (const schedule of schedules.data.items) {
            if (!schedule.cronExpression.includes('0 14 * * 1')) {
                await fetch(`https://api.apify.com/v2/schedules/${schedule.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${process.env.APIFY_TOKEN}`,
                    },
                });
                console.log(`Deleted schedule: ${schedule.id}`);
            }
        } return;
    } catch (error) {
        console.error('Error deleting schedules:', error.message);
    }
}

async function createScheduleEvery2Hours() {
    try {
        const response = await fetch('https://api.apify.com/v2/schedules', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.APIFY_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch schedules: ${response.statusText}`);
        }
        
        const schedules = await response.json();
        if (!schedules.data || !Array.isArray(schedules.data.items)) {
            throw new Error('Schedules data is missing or invalid.');
        }

        const scheduleExists = schedules.data.items.some(schedule => schedule.cronExpression === '0 */3 * * *');

        if (!scheduleExists) {
            const newScheduleResponse = await fetch('https://api.apify.com/v2/schedules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.APIFY_TOKEN}`,
                },
                body: JSON.stringify({
                    name: 'every-3-hours',
                    title: 'Every 3 Hours Schedule',
                    isEnabled: true,
                    isExclusive: true,
                    timezone: 'Asia/Tehran',
                    cronExpression: '0 */3 * * *',
                    actions: [
                        {
                            type: 'RUN_ACTOR',
                            actorId: '---', //put the actor ID here
                        },
                    ],
                }),
            });

            if (!newScheduleResponse.ok) {
                throw new Error(`Failed to create schedule: ${newScheduleResponse.statusText}`);
            }

            const newSchedule = await newScheduleResponse.json();
            console.log(`Created schedule to run every 2 hours: ${newSchedule.id}`);
        } else {
            console.log('2-hour schedule already exists.');
        } return;
    } catch (error) {
        console.error('Error creating schedule:', error.message);
    }
}

const checkNextWeekMenu = (async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        const loginUrl = 'https://jeton.araku.ac.ir/Account/Login';
        await page.goto(loginUrl);

        const username = process.env.JET_USERNAME;
        const password = process.env.JET_PASSWORD;

        await page.type('input[name="UserName"]', username);
        await page.type('input[name="Password"]', password);
        await page.click('button[type="submit"]'); 
        await page.waitForNavigation();

        console.log('successful login!');

        const subdomainUrl = 'https://jeton.araku.ac.ir/Reserves';
        await page.goto(subdomainUrl);
        console.log('successful redirect to reservation page!');

        await new Promise(resolve => setTimeout(resolve, 2000));

         await page.select('#Restaurant');
         console.log('restaurant selected successfully!');

        await new Promise(resolve => setTimeout(resolve, 2000));

        await page.evaluate(() => {
            const nextWeekButton = document.querySelector('#NextWeek');
            if (nextWeekButton) {
                nextWeekButton.click();
                console.log('clicked on next week');
            } else {
                console.error('Next week not found.');
            }
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        const hasCheckboxes = await page.evaluate(() => {
            return document.querySelectorAll('.reserveFoodCheckBox').length > 0;
        });

        await browser.close();


        if (hasCheckboxes) {
            await deleteSchedulesExceptMonday();

            await fetch('https://reservreminderv2.glitch.me/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': '${process.env.SECRET_KEY}',
                },
                body: JSON.stringify({
                    siteStatus: true,
                }),
            });
            console.log('updated')
        } else {
            console.log('Site not updated.');
            await createScheduleEvery2Hours();
        } return;
    } catch (error) {
        console.error('Error: ', error.message);
    }
});
checkNextWeekMenu();