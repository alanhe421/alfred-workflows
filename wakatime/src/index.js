/// <reference path="./node_modules/@stacker/alfred-utils/dist/environment.d.ts" />

/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const { http, Workflow } = require('@stacker/alfred-utils');
const [, ,] = process.argv;
const instance = http.createHttpClient();
const wf = new Workflow();

// WakaTime API configuration
const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;
const WAKATIME_BASE_URL = 'https://wakatime.com/api/v1';

/**
 * Format seconds to human readable time
 */
function formatDuration(seconds) {
  if (!seconds) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Fetch WakaTime data for today
 */
async function fetchWakaTimeData() {
  const today = getTodayDate();
  const url = `${WAKATIME_BASE_URL}/users/current/summaries`;

  const response = await instance.get(url, {
    params: {
      start: today,
      end: today
    },
    headers: {
      Authorization: `Basic ${Buffer.from(WAKATIME_API_KEY).toString('base64')}`
    }
  });

  return response.data;
}

(async function () {
  try {
    const data = await fetchWakaTimeData();

    if (!data.data || data.data.length === 0) {
      wf.addWorkflowItem({
        item: {
          title: 'No coding data for today',
          subtitle: 'Start coding to see your stats!'
        }
      });
    } else {
      const todayData = data.data[0];
      const totalSeconds = todayData.grand_total.total_seconds;
      const totalTime = formatDuration(totalSeconds);

      // Add total time item
      wf.addWorkflowItem({
        item: {
          title: `Today's Coding Time: ${totalTime}`,
          subtitle: `${todayData.grand_total.text}`,
          icon: {
            path: 'assets/coding-time.svg'
          }
        }
      });

      // Add top languages
      if (todayData.languages && todayData.languages.length > 0) {
        const topLanguages = todayData.languages
          .slice(0, 3)
          .map((lang) => `${lang.name} (${formatDuration(lang.total_seconds)})`)
          .join(', ');

        wf.addWorkflowItem({
          item: {
            title: 'Top Languages',
            subtitle: topLanguages,
            icon: {
              path: 'assets/languages.svg'
            }
          }
        });
      }

      // Add top projects
      if (todayData.projects && todayData.projects.length > 0) {
        const topProjects = todayData.projects
          .slice(0, 3)
          .map((proj) => `${proj.name} (${formatDuration(proj.total_seconds)})`)
          .join(', ');

        wf.addWorkflowItem({
          item: {
            title: 'Top Projects',
            subtitle: topProjects,
            icon: {
              path: 'assets/projects.svg'
            }
          }
        });
      }

      // Add editor info
      if (todayData.editors && todayData.editors.length > 0) {
        const editor = todayData.editors[0];
        wf.addWorkflowItem({
          item: {
            title: `Editor: ${editor.name}`,
            subtitle: `${formatDuration(editor.total_seconds)}`,
            icon: {
              path: 'assets/editor.svg'
            }
          }
        });
      }
    }
  } catch (error) {
    wf.addWorkflowItem({
      item: {
        title: 'Error fetching WakaTime data',
        subtitle: error.message
      }
    });
  }

  wf.run();
})();
