function TASK_TEMPLATE() {
  return `
    
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Task Notification</title>
  </head>

  <body style="margin:0;background:#ffffff;font-family:system-ui,-apple-system,Segoe UI,Roboto;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:32px 12px">

          <table width="100%" style="max-width:460px;border:1px solid #eaeaea;border-radius:8px;padding:24px">

            <tr>
              <td align="center">
                <img src="https://your-cdn.com/collabflow-logo.png" width="40" height="40" />
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-top:24px;font-size:22px;font-weight:500">
                Task {{action}}
              </td>
            </tr>

            <tr>
              <td style="padding-top:24px;font-size:14px">
                Hello <strong>{{userName}}</strong>,
              </td>
            </tr>

            <tr>
              <td style="padding-top:12px;font-size:14px;line-height:22px">
                <strong>{{actorName}}</strong> {{action}} a task in
                <strong>{{projectName}}</strong>.
              </td>
            </tr>

            <tr>
              <td style="padding-top:12px;font-size:14px">
                <strong>Task:</strong> {{taskTitle}}
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-top:32px">
                <a
                  href="{{taskUrl}}"
                  style="background:#000;color:#fff;padding:12px 20px;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none">
                  View task
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding-top:24px;font-size:13px">
                Project: <strong>{{projectName}}</strong><br />
                Workspace: <strong>{{workspaceName}}</strong>
              </td>
            </tr>

            <tr>
              <td>
                <hr style="border:none;border-top:1px solid #eaeaea;margin:32px 0" />
              </td>
            </tr>

            <tr>
              <td style="font-size:12px;color:#666">
                You are receiving this because you are assigned to this task.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>

    `;
}
