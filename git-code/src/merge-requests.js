/**
 * usage
 * /usr/local/bin/node ./merge-requests.js
 */
const { utils, http, Workflow } = require('@stacker/alfred-utils');
const [, , query] = process.argv;
const wf = new Workflow();
(async function () {
  const items = await searchMergeRequests(
    process.env.token,
    process.env.baseUrl,
    process.env.projectId,
    process.env.projectName
  );
  items.map((item) =>
    wf.addWorkflowItem({
      item
    })
  );
  wf.filterWorkflowItemsBy(query, ['title', 'subtitle'], {
    item: {
      title: `No Opened Merge Requests for ${process.env.projectName}`,
      subtitle: `Goto ${process.env.baseUrl}/${process.env.projectName}/merge_requests`,
      arg: `${process.env.baseUrl}/${process.env.projectName}/merge_requests`
    }
  });
  wf.run();
})();

async function searchMergeRequests(token, baseUrl, projectId, projectName) {
  if (!token || !baseUrl) {
    return [];
  }
  try {
    const instance = http.createHttpClient(baseUrl);
    const res = await instance.get(
      `/api/v3/projects/${projectId}/merge_requests`,
      {
        params: {
          private_token: token,
          per_page: process.env.per_page || 20,
          state: 'opened'
        }
      }
    );
    if (res.data.length === 0) {
      return [
        utils.buildItem({
          title: `No Opened Merge Requests`,
          subtitle: `Goto ${baseUrl}/${projectName}/merge_requests`,
          arg: `${baseUrl}/${projectName}/merge_requests`
        })
      ];
    }
    const items = res.data.map((item) =>
      utils.buildItem({
        title: item.title,
        subtitle: `source:${item.source_branch} ➡️ target:${item.target_branch}`,
        autocomplete: item.title,
        text: {
          largetype: item.description,
          copy:appendFooterCopyText(buildCopyText(baseUrl, projectName, item)),
        arg: `${baseUrl}/${projectName}/merge_requests/${item.iid}`
      }})
    );

    let allMRLinks = res.data
      .map(
        (item) =>
        buildCopyText(baseUrl,projectName,item)
      )
      .join('\n\n');

    items.unshift(
      utils.buildItem({
        title: 'Copy All MRs',
        subtitle: `⌘+c copy to clipboard`,
        autocomplete: 'Copy All MRs',
        text: {
          largetype: allMRLinks,
          copy: appendFooterCopyText(allMRLinks)
        },
        arg: `${baseUrl}/${projectName}/merge_requests/`
      })
    );
    return items;
  } catch (e) {
    return [
      utils.buildItem({
        title: baseUrl,
        subtitle: 'something wrong:' + e
      })
    ];
  }
}
function buildCopyText(baseUrl, projectName, item) {
  return process.env.mr_links_copy_text.replace(/{{(.*?)}}/g, function (match, key) {
    if (key === 'link') {
      return `${baseUrl}/${projectName}/merge_requests/${item.iid}`;
    }
    return item[key] || match;
  });
}

// {var:mr_link_copy_text_footer}
function appendFooterCopyText(text) {
  if (process.env.mr_links_copy_text_footer) {
    text += `\n\n\n${process.env.mr_links_copy_text_footer}`;
  }
  return text;
}
